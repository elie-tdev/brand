import * as fs from 'fs'
import * as puppeteer from 'puppeteer'
import * as ColorThief from 'color-thief'
import { compact, uniqBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { ScraperEntity, ScrapeResponse } from './scraper.entity'
import { BrandEntity } from '@module/brand/brand.entity'
import { DatabaseService } from '@module/database/database.service'
import { keysToCamel } from '@common/util/keysToCamel'
import { toHex, buildColorObj } from '@common/util/colorUtils';
import { mkTmpDir } from '@common/util/mkTmpDir';
import { reportError } from '@common/util/reportError';
import { ApolloError } from 'apollo-server-errors';
import { s3Uploader } from '@common/util/s3Uploader';
import { promisify } from 'util';
import { LogoService } from '@module/logo/logo.service';

@Injectable()
export class ScraperService {
  constructor(
    private readonly db: DatabaseService,
    private readonly logoService: LogoService,
  ) { }
  private readonly logger = new Logger(ScraperService.name)

  async scrapesByBrandId(
    brandId: BrandEntity['brandId']
  ): Promise<ScraperEntity[]> {
    return await this.db.conn
      .any(
        'SELECT * FROM scapes WHERE brand_id = $1',
        [brandId],
      )
      .then((scrapes: ScraperEntity[]) => {
        return keysToCamel(scrapes)
      })
  }

  async scrapeThisUrl(
    brandName: BrandEntity['brandName'],
    websiteUrl: BrandEntity['websiteUrl'],
    brandId: BrandEntity['brandId'],
  ): Promise<ScrapeResponse> {
    const unlinkAsync = promisify(fs.unlink)
    const { screenshotsTmpDir } = await mkTmpDir(brandId)
    const fullScreenshot = `${screenshotsTmpDir}/full_${Date.now()}.png`
    const clipScreenshot = `${screenshotsTmpDir}/clip_${Date.now()}.png`

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: true,
    })
    const page = await browser.newPage()
    this.logger.log(`Opening page for ${websiteUrl}`)
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(websiteUrl, {
      waitUntil: 'networkidle2',
      timeout: 100000,
    }).catch(async err => {
      await reportError(err)
      await browser.close().then(() => {
        this.buildLogoOnlyDraftGuideline(brandName, websiteUrl, brandId)
      })
      throw new ApolloError('Scraper Failed', 'SCRAPE_FAILED', err)
    })
    // Take some screenshots
    await page.screenshot({
      path: fullScreenshot,
      fullPage: true,
    })
    await page.screenshot({
      path: clipScreenshot,
    })

    const getTypeSet = async (el: string, title: string) => {
      // tslint:disable-next-line: no-shadowed-variable
      const styles = await page.evaluate(el => {
        const element = document.querySelector(el)
        if (element !== null) {
          return JSON.parse(JSON.stringify(getComputedStyle(element)))
        }
        return
      }, el)

      if (styles !== undefined) {
        return {
          _id: uuidv4(),
          title,
          tags: [el, title],
          element: el,
          color: toHex(styles.color) || null,
          font: styles.font,
          fontFamily: styles.fontFamily || null,
          fontSize: styles.fontSize || null,
          fontVariant: styles.fontVariant || null,
          fontWeight: styles.fontWeight || null,
        }
      }
      return
    }

    const getScrapedColors = async (el: string) => {
      // tslint:disable-next-line: no-shadowed-variable
      return await page.evaluate(el => {
        const elements = Array.from(document.querySelectorAll(el))
        const scrapedColorsArr = []
        elements.map(element => {
          if (element !== null) {
            const styles = JSON.parse(JSON.stringify(getComputedStyle(element)))
            scrapedColorsArr.push(
              styles.color || null,
              styles.backgroundColor || null,
            )
            scrapedColorsArr.filter((elem, pos, arr) => arr.indexOf(elem) === pos)
          }
          return
        })
        return scrapedColorsArr.filter(
          (elem, pos, arr) => arr.indexOf(elem) === pos,
        )
      }, el)
    }

    const getColorThief = (filePath: string) => {
      const rgbList = []
      if (fs.existsSync(filePath)) {
        const colorThief = new ColorThief()
        const palettes = colorThief.getPalette(filePath, 10)

        palettes.map((palette: number[]) => {
          rgbList.push(`rgb(${palette})`)
        })
        return rgbList
      }
      return
    }

    const logo = await this.logoService.scrapeLogo(websiteUrl, brandId)

    let typography = [
      await getTypeSet('h1', 'Header 1'),
      await getTypeSet('h2', 'Header 2'),
      await getTypeSet('h3', 'Header 3'),
      await getTypeSet('h4', 'Header 4'),
      await getTypeSet('h5', 'Header 5'),
      await getTypeSet('h6', 'Header 6'),
      await getTypeSet('p', 'Paragraph'),
      await getTypeSet('a', 'Link'),
      await getTypeSet('body', 'Body'),
    ]
    // Trim nulls
    typography = compact(typography)

    const colorsArr = []
    const aColors = await getScrapedColors('a')
    const buttonColors = await getScrapedColors('button')
    const colorThiefColors = await getColorThief(fullScreenshot)
    colorsArr.push(...aColors, ...buttonColors, ...colorThiefColors)
    colorsArr.filter((elem, pos, arr) => arr.indexOf(elem) === pos)

    const screenshots = {
      full: await s3Uploader(fullScreenshot),
      clip: await s3Uploader(clipScreenshot),
    }
    const site = {
      title: (await page.title()) || null,
      // description:
      //   (await page.$eval(
      //     "head > meta[name='description']",
      //     element => element.textContent
      //   )) || null
    }
    // Delete temp file upload
    unlinkAsync(fullScreenshot)
    unlinkAsync(clipScreenshot)
    const data = {
      meta: [
        site,
        screenshots,
      ],
      logos: [logo],
      typography,
      colors: uniqBy(await buildColorObj(colorsArr), 'hex'),
      // images: await page.$$eval('img[src]', imgs =>
      //   imgs.map(img => img.getAttribute('src'))
      // )
    }
    // this.logger.log(JSON.stringify(data))

    await browser.close()

    const url = websiteUrl.toString()
    const domainSlug = url.replace(/https?:\/\//, '').replace(/\.|\//g, '-').replace(/-$/, '')

    const scrapeId = await this.db.conn.one(
      `with new_scrape as (
        insert into scrapes (
          brand_id,
          scraped_obj
        ) values (
          $1,
          $2
        ) returning scrape_id,brand_id,scraped_obj
      ),
      draft_save as (
        insert into draft_guidelines (
          brand_id,
          scrape_id,
          draft_guideline_obj
        ) select
            new_scrape.brand_id::uuid,
            new_scrape.scrape_id::uuid,
            new_scrape.scraped_obj::jsonb
        from new_scrape
        returning draft_guideline_id
      ),
      brand_scrape as (
        update brands
          set draft_guideline_id = draft_save.draft_guideline_id,
            brand_name = $3,
            domain_slug = $5,
            website_url = $4
          from draft_save
          where brand_id = $1
        returning draft_save.draft_guideline_id
      ) select draft_guideline_id from brand_scrape;`,
      [brandId, data, brandName, websiteUrl, domainSlug],
    )
    // this.logger.log(`scrapeThisUrl - scrapeId -> ${JSON.stringify(scrapeId)}`)
    // this.logger.log(`scrapeThisUrl - logo -> ${JSON.stringify(logo)}`)

    return keysToCamel({ ...scrapeId, logo })
  }

  async buildLogoOnlyDraftGuideline(
    brandName: BrandEntity['brandName'],
    websiteUrl: BrandEntity['websiteUrl'],
    brandId: BrandEntity['brandId'],
  ): Promise<ScrapeResponse> {

    const logo = await this.logoService.scrapeLogo(websiteUrl, brandId)

    const data = {
      meta: [],
      logos: [logo],
      typography: [],
      colors: [],
    }

    const domainSlug = websiteUrl.replace('http:\/\/', '').replace(/\./g, '-')

    const guidelineId = await this.db.conn.one(
      `with draft_save as (
        insert into draft_guidelines (
          brand_id,
          draft_guideline_obj
        ) select
            $1::uuid,
            $2::jsonb
        returning draft_guideline_id
      ),
      brand_update as (
        update brands
          set draft_guideline_id = draft_save.draft_guideline_id,
            brand_name = $3,
            domain_slug = $5,
            website_url = $4
          from draft_save
          where brand_id = $1
        returning draft_save.draft_guideline_id
      ) select draft_guideline_id from brand_update;`,
      [brandId, data, brandName, websiteUrl, domainSlug],
    )

    return keysToCamel({ ...guidelineId })

    // await this.logoService.scrapeLogo(websiteUrl, brandId)

  }
}

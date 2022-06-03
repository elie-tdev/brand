import { Injectable, HttpService } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { keysToCamel } from '../../common/util/keysToCamel'
import { LogoEntity } from './logo.entity'
import { BrandEntity } from '../brand/brand.entity'
const AWS = require('aws-sdk')
const TransloaditClient = require('transloadit')

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = process.env.REGION;
let s3 = new AWS.S3()
// TODO: move AWS config and setup to middleware

const utils = {
	makeFilename : function(url){
		var urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d\.-]+)\.(?:[a-z\.]{2,10})(?:[/\w\.-]*)*/;
    const domain = url.match(urlPattern)
    let result = domain[1] + '/logo.png'
		// TODO: make the file name dynamic
    return result
	}
}

@Injectable()
export class LogoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly db: DatabaseService
  ) {}

	async allLogos(): Promise<LogoEntity[]> {
		return await this.db.conn
			.any('SELECT * FROM logos')
			.then((logos: LogoEntity[]) => {
				return keysToCamel(logos)
			})
	}

  // using transloadit to encode an uploaded image file
	async encodeLogo(
		imageFile: string,
		brandID: BrandEntity['brandId'],
	): Promise<LogoEntity['logoUrl']> {

		const template = {
		    "steps": {
		      "convert_image_png": {
		        "use": ":original",
		        "robot": "/image/resize",
		        "format": "png",
		        "trim_whitespace": true,
		      },
		      "optimize_png": {
		        "robot": "/image/optimize",
		        "use": "convert_image_png"
		      },
		      "store": {
		        "use": ["optimize_png"],
		        "robot": "/s3/store",
		        "bucket": process.env.LOGO_BUCKET,
		        "bucket_region": process.env.LOGO_BUCKET_REGION,
		        "key": process.env.AWS_ACCESS_KEY_ID,
		        "secret": process.env.AWS_SECRET_ACCESS_KEY,
		        "path": `${brandID}` + "/${file.url_name}"
		      }
		    }
		}

		const params = {
		  name: 'temporary',
		  template,
		}

	  const client = new TransloaditClient({
	    authKey: process.env.TRANSLOADIT_API_KEY,
	    authSecret: process.env.TRANSLOADIT_SECRET_KEY
	  })

	  let result = await client.createTemplate(params, (err, result) => {
	    if (err) {
	      return console.log('Failed in creating template', err.message, err)
	    }
      const doneCb = (err, status) => {
        let assemblyId = ''
        if (status) {
          if (status.assembly_id) {
            assemblyId = status.assembly_id
          }
          if (!err && status.error) {
            err = `${status.error}. ${status.message}. `
          }
        }
        if (err) {
          console.error({ status })
          throw new Error(`❌ Unable to process Assembly ${assemblyId}. ${err}`)
        }
        console.log('s3 URL =>', status.results.optimize_png[0].signed_ssl_url )
        console.log(`✅ Success`)
      }

      const progressCb = (ret) => {
        let msg = ''
        if (ret.uploadProgress) {
          msg += `♻️ Upload progress polled: ` + ret.uploadProgress.uploadedBytes + ` of ` + ret.uploadProgress.totalBytes + ` bytes uploaded.`
        }
        if (ret.assemblyProgress) {
          msg += `♻️ Assembly progress polled: ${ ret.assemblyProgress.error ? ret.assemblyProgress.error : ret.assemblyProgress.ok } ret.assemblyProgress.assembly_id ... `
        }
        console.log(msg)
      }
      const options = {
        waitForCompletion: true,
        params           : {
          template_id: result.id,
        },
      }
      client.addFile('myFile', imageFile)
      client.createAssembly(options, doneCb, progressCb)

      // cleanup and remove temporary template
      setTimeout(() => {
        client.deleteTemplate(result.id, (err, delResult) => {
          if (err) {
            return console.log('failed deleting template:', err)
          }
          console.log('Successfully deleted template', delResult)
        })
      }, 5000)
    })
		return this.db.conn.one(
			`insert into logos (
				brand_id,
				logo_url
			) values (
				$1,
				$2
			) returning logo_url`,
			 [brandID, result]
		)
	}

  // uses the ritekit api to pull a logo image from a url
  async scrapeLogo(
    websiteURL: BrandEntity['websiteUrl'],
    brandID: BrandEntity['brandId'],
  ): Promise<LogoEntity['logoUrl']> {
		let imageData, result
    await this.httpService.get(
			process.env.RITEKIT_URL
        + websiteURL
        + process.env.RITEKIT_API_KEY,
      ).toPromise()
      .then(async response => {
        var params = {
         Bucket: process.env.LOGO_BUCKET,
         Key: utils.makeFilename(websiteURL),
         // TODO: pass the file type extention from ritekit to make the filename
         Body: response.data
        }
        imageData = await s3.upload(params, (err, data) => {
          if (err) {
            console.log(err.message, err)
            return { message: err.message, stack: err }
          }
        })
				// attach the s3 location
				let href = await imageData.service.endpoint.href
				result = href + process.env.LOGO_BUCKET + '/' + params.Key
			 })
				return this.db.conn.one(
					`insert into logos (
						brand_id,
						logo_url
					) values (
						$1,
						$2
					) returning logo_url`,
					[brandID, result]
				)
    }
}

import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util';
import { BrandEntity } from '@module/brand/brand.entity';

export const mkTmpDir = async (brandId: BrandEntity['brandId']) => {
  const mkdirAsync = promisify(fs.mkdir)
  const tmpDir = path.resolve(__dirname, `../../../tmp`)
  const screenshotsTmpDir = `${tmpDir}/${brandId}/screenshots`
  const logosTmpDir = `${tmpDir}/${brandId}/logos`

  if (!fs.existsSync(screenshotsTmpDir)) {
    await mkdirAsync(screenshotsTmpDir, { recursive: true });
  }
  if (!fs.existsSync(logosTmpDir)) {
    await mkdirAsync(logosTmpDir, { recursive: true });
  }
  return { tmpDir, screenshotsTmpDir, logosTmpDir }
}

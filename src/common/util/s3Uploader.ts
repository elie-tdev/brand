import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import { CompleteMultipartUploadOutput } from 'aws-sdk/clients/s3'
import { ApolloError } from 'apollo-server-errors'
import { promisify } from 'util';

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
AWS.config.region = process.env.REGION
const s3 = new AWS.S3()

const s3Upload = params => {
  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        reject(error)
      }
      resolve(data)
    })
  })
}

export const s3Uploader = async (
  filePath: string,
): Promise<string> => {
  const readFileAsync = promisify(fs.readFile)
  const fileData = await readFileAsync(filePath)
  const fileKey = filePath.replace(/\/usr\/src\/app\/tmp\//g, '')
  const params = {
    Bucket: process.env.CLIENT_UPLOADS_BUCKET,
    Key: fileKey,
    Body: fileData,
  }
  return await s3Upload(params)
    .then((data: CompleteMultipartUploadOutput) => {
      // console.log(
      //   `s3Uploader - data.Location -> ${JSON.stringify(data.Location)}`,
      // )
      return data.Location
    })
    .catch(err => {
      throw new ApolloError(err.message, 'S3_UPLOAD_FAILED', err)
    })
}

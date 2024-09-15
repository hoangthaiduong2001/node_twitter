import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'

config()

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

export const uploadFileToS3 = ({
  filename,
  pathname,
  contentType
}: {
  filename: string
  pathname: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: 'twitter-ap-southeast-1-media',
      Key: filename,
      Body: fs.readFileSync(pathname),
      ContentType: contentType
    },

    tags: [
      /*...*/
    ],
    queueSize: 4,

    // (optional) size of each part, in bytes, at least 5MB
    partSize: 1024 * 1024 * 5,

    leavePartsOnError: false
  })
  return parallelUploads3.done()
}

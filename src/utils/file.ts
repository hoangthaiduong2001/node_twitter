import { Request } from 'express'
import formidable, { Fields, File, Files, Part } from 'formidable'
import fs from 'fs'
import { IncomingMessage } from 'http'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true //create folder nested example: uploads/image
    })
  }
}

//fix esmoudle in commonjs
//type formidable of v2
// const formidable = (await import('formidable')).default
export const handleUploadSingleImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFieldsSize: 30 * 1024,
    filter: function ({ name, originalFilename, mimetype }: Part) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File>((resolve, reject) => {
    form.parse(req as IncomingMessage, (err: any, fields: Fields<string>, files: Files<string>) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve((files.image as File[])[0])
    })
  })
}

export const getFileWithoutExtend = (fileName: string) => {
  const name = fileName.split('.')
  name.pop()
  return name.join('')
}

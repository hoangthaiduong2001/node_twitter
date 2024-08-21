import { Request } from 'express'
import formidable, { Fields, File, Files, Part } from 'formidable'
import fs from 'fs'
import { IncomingMessage } from 'http'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
        recursive: true //create folder nested example: uploads/image
      })
    }
  })
}

//fix esmoudle in commonjs
//type formidable of v2
// const formidable = (await import('formidable')).default
export const handleUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    maxFieldsSize: 30 * 1024,
    maxTotalFileSize: 30 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }: Part) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req as IncomingMessage, (err: any, fields: Fields<string>, files: Files<string>) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      const images = files.image as File[]
      images.forEach((image) => {
        const extension = getExtension(image.originalFilename as string)
        fs.renameSync(image.filepath, image.filepath + '.' + extension)
        image.newFilename = image.newFilename + '.' + extension
      })
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const nanoId = (await import('nanoid')).nanoid
  const idName = nanoId()
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFieldsSize: 50 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }: Part) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: function () {
      return idName
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req as IncomingMessage, (err: any, fields: Fields<string>, files: Files<string>) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const extension = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + extension)
        video.newFilename = video.newFilename + '.' + extension
        video.filepath = video.filepath + '.' + extension
      })
      resolve(files.video as File[])
    })
  })
}

export const getFileWithoutExtend = (filename: string) => {
  const name = filename.split('.')
  name.pop()
  return name.join('')
}

export const getExtension = (filename: string) => {
  const name = filename.split('.')
  return name[name.length - 1]
}

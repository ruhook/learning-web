const path = require('path')
const fs = require('fs')
const aliOss = require('ali-oss') //  阿里云 oss
const async = require('async') // 处理异步fn
// const config = require('config') // 读取本地json配置
// const glob = require('glob') // 正则过滤本地文件

let _config = require('./config') // 常规配置项

class Oss {
  constructor(config) {
    this.client = new aliOss(config)
  }

  upload(params) {
    const name = params.name
    const content = params.content
    return await this.client.put(name, content, options)
  }

}

const waterfallUploadFiles = (
  fileList,
  client,
  getOption,
  callback,
  isRemoveFile = true
) => {
  let pools = []
  fileList.forEach(filePath => {
    pools.push(function(next) {
      console.log(`file >> ${filePath} << uploading!`)
      client
        .upload(getOption(filePath))
        .then(result => {
          if (isRemoveFile) {
            fs.unlinkSync(filePath)
            console.log(`file >> ${filePath} << upload success! delete file`)
          } else {
            console.log(`file >> ${filePath} << upload success!`)
          }
          next()
        })
        .catch(err => {
          console.log(`file >> ${filePath} << upload failed!`)
          next()
        })
    })
  })
  async.waterfall(pools, err => {
    if (err) {
      console.log(err)
    }
    callback && callback(err)
  })
}

//_config    jsFiles,cssFiles,imgFiles,jsFiles

const ossClient = new OSSUtil(
  Object.assign({}, ossSetting, { timeout: 1000 * 60 * 60 })
)

async.waterfall(
  [
    callback => {
      waterfallUploadFiles(
        _config.jsFiles,
        ossClient,
        filePath => {
          return {
            content: filePath,
            bucket: ossBucket,
            name: getCdnPath(filePath),
            options: {
              headers: {
                'content-type': 'application/javascript;charset=utf-8',
                'cache-control': 'max-age=315360000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
              }
            }
          }
        },
        callback
      )
    },
    callback => {
      waterfallUploadFiles(
        cssFileList,
        ossClient,
        filePath => {
          return {
            content: filePath,
            bucket: ossBucket,
            name: getCdnPath(filePath),
            options: {
              headers: {
                'content-type': 'text/css;charset=utf-8',
                'cache-control': 'max-age=315360000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
              }
            }
          }
        },
        callback
      )
    },
    callback => {
      waterfallUploadFiles(
        imgFileList,
        ossClient,
        filePath => {
          const contentType = {
            [`jpg`]: 'image/jpg',
            [`jpeg`]: 'image/jpeg',
            [`png`]: 'image/png',
            [`gif`]: 'image/gif',
            [`webp`]: 'image/webp'
          } [path.extname(filePath).replace('.', '')]
          return {
            content: filePath,
            bucket: ossBucket,
            name: getCdnPath(filePath),
            options: {
              headers: {
                'content-type': contentType,
                'cache-control': 'max-age=315360000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
              }
            }
          }
        },
        callback
      )
    },
    callback => {
      waterfallUploadFiles(
        svgFileList,
        ossClient,
        filePath => {
          const contentType = {
            [`svg`]: 'image/svg+xml'
          } [path.extname(filePath).replace('.', '')]
          return {
            content: filePath,
            bucket: ossBucket,
            name: getCdnPath(filePath),
            options: {
              headers: {
                'content-type': contentType,
                'cache-control': 'max-age=315360000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
              }
            }
          }
        },
        callback
      )
    },
    callback => {
      waterfallUploadFiles(
        mediaFileList,
        ossClient,
        filePath => {
          const contentType = {
            [`mp4`]: 'video/mp4',
            [`webm`]: 'video/webm',
            [`ogg`]: 'audio/ogg',
            [`mp3`]: 'audio/mp3',
            [`wav`]: 'audio/wav',
            [`flac`]: 'audio/flac',
            [`aac`]: 'audio/aac'
          } [path.extname(filePath).replace('.', '')]
          return {
            content: filePath,
            bucket: ossBucket,
            name: getCdnPath(filePath),
            options: {
              headers: {
                'content-type': contentType,
                'cache-control': 'max-age=315360000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
              }
            }
          }
        },
        callback
      )
    },
    callback => {
      waterfallUploadFiles(
        fontFileList,
        ossClient,
        filePath => {
          const contentType = {
            [`woff`]: 'application/x-font-woff',
            [`woff2`]: 'application/x-font-woff2',
            [`eot`]: 'application/vnd.ms-fontobject',
            [`ttf`]: 'application/x-font-truetype',
            [`otf`]: 'application/x-font-opentype'
          } [path.extname(filePath).replace('.', '')]
          return {
            content: filePath,
            bucket: ossBucket,
            name: getCdnPath(filePath),
            options: {
              headers: {
                'content-type': contentType,
                'cache-control': 'max-age=315360000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
              }
            }
          }
        },
        callback
      )
    }
  ],
  err => {
    if (err) {
      console.log(err)
    }
  }
)
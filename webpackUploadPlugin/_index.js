const utils = require('./_utils')
const config = require('./node_modules/config')
const path = require('path')
const glob = require('./node_modules/glob')
const async = require('./node_modules/async')
const fs = require('fs')
const OSS = require('./node_modules/ali-oss')

class OSSUtil {
  constructor(config) {
    this.client = new OSS(config)
  }

  async upload(params) {
    const bucket = params.bucket
    const name = params.name
    const content = params.content
    const options = params.options
    this.client.useBucket(bucket)
    /* eslint-disable-next-line */
    return await this.client.put(name, content, options)
  }
}

// 本地资源 文件路径
const publishPath = path.resolve(
  __dirname,
  '../',
  config.get('webpack.output.path')
)
// 上传oss 路径
const prefixPath = utils.getCdnPrefixPath()
// ossSetting
const ossSetting = config.get('cdnSetting.config')
// ossBucket
const ossBucket = config.get('cdnSetting.bucket')

/**
 * cdn static url
 * @param relovePath
 * @returns {string}   ？？？
 */
function getCdnPath(resolvePath) {
  const fileName = path.basename(resolvePath)
  const filePath = path.dirname(resolvePath)
  const assetsPath = filePath.replace(path.join(publishPath, '/'), '')
  const cdnPath = path.join(prefixPath, assetsPath, fileName)
  return cdnPath
}

/**
 * waterFallUploadFile
 * @param fileStreams
 * @param client
 * @param getOption
 * @param callback
 * @param isRemoveFile
 */
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

const jsFileList = glob.sync(
  `${publishPath}/**/${config.get('webpack.assetsPrefixDir')}/**/*.?(js|js.map)`
)
const cssFileList = glob.sync(
  `${publishPath}/**/${config.get(
    'webpack.assetsPrefixDir'
  )}/**/*.?(css|css.map)`
)
const imgFileList = glob.sync(
  `${publishPath}/**/${config.get(
    'webpack.assetsPrefixDir'
  )}/**/*.?(jpg|jpeg|png|gif|webp)`
)
const svgFileList = glob.sync(
  `${publishPath}/**/${config.get('webpack.assetsPrefixDir')}/**/*.?(svg)`
)
const mediaFileList = glob.sync(
  `${publishPath}/**/${config.get(
    'webpack.assetsPrefixDir'
  )}/**/*.?(mp4|webm|ogg|mp3|wav|flac|aac)`
)
const fontFileList = glob.sync(
  `${publishPath}/**/${config.get(
    'webpack.assetsPrefixDir'
  )}/**/*.?(woff|woff2|eot|ttf|otf)`
)

const ossClient = new OSSUtil(
  Object.assign({}, ossSetting, { timeout: 1000 * 60 * 60 })
)

async.waterfall(
  [
    callback => {
      waterfallUploadFiles(
        jsFileList,
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
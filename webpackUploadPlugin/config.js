const path = require('path')
const config = require('config') // 读取本地json配置
const glob = require('glob') // 正则过滤本地文件

// oss 配置项
const options = {
  accessKeyId: 'LTAIgTMyqmc8vAoI',
  accessKeySecret: 'o0TfL6QpGhVK3Dl1B25yjuvbmqEePH',
  region: 'oss-cn-beijing',
  bucket: 'bccf-static'
}

// 本地资源 文件路径
const publishPath = path.resolve(
  __dirname,
  'dist'
)
//  js  css  fonts img    -- 按照vue-cli3 的打包习惯来做得 文件筛选
// js
const jsFiles = glob.sync(`${publishPath}/**/*.?(js|js.map)`)
// css
const cssFiles = glob.sync(`${publishPath}/**/*.?(css|css.map)`)
// img
const imgFiles = glob.sync(`${publishPath}/**/*.?(jpg|jpeg|png|gif|webp)`)
// fonts
const jsFiles = glob.sync(`${publishPath}/**/*.?(woff|woff2|eot|ttf|otf)`)

module.exports = {
  options,
  publishPath,
  jsFiles,
  cssFiles,
  imgFiles,
  jsFiles
}
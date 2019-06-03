const path = require('path')
const config = require('./node_modules/config')
const pkg = require('../package')
const open = require('./node_modules/open')
const notifier = require('node-notifier')
const _isArray = require('./node_modules/lodash/isArray')

const resolve = (dir = '') => path.join(__dirname, '..', dir)
const getCdnPrefixPath = () => {
  const webpackCdnConfig = config.get('webpack.cdn')
  const publicPath = config.get('webpack.output.publicPath')
  if (webpackCdnConfig.version) {
    return `${path.posix.join(webpackCdnConfig.prefixPath, pkg.version, publicPath)}`
  } else {
    return `${path.posix.join(webpackCdnConfig.prefixPath, publicPath)}`
  }
}

module.exports = {
  resolve,
  open,
  getCdnPrefixPath,
  getPublicPath: () => {
    const publicPath = config.get('webpack.output.publicPath')
    if (config.get('webpack.cdn.enabled')) {
      return `${config.get('cdnSetting.target')}/${getCdnPrefixPath()}`
    } else {
      return publicPath
    }
  },
  getIpAddress: () => {
    const interfaces = require('os').networkInterfaces()
    for (const devName in interfaces) {
      const iface = interfaces[devName]
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
  },
  cacheUse: (cacheDir, loader) => {
    const cacheLoader = {
      loader: 'cache-loader',
      options: {
        cacheDirectory: resolve(`node_modules/.cache/${cacheDir}`)
      }
    }
    if (_isArray(loader)) {
      return [cacheLoader, ...loader]
    } else {
      return [cacheLoader, loader]
    }
  },
  threadUse: (loader) => {
    const threadLoader = {
      loader: 'thread-loader'
    }
    if (_isArray(loader)) {
      return [threadLoader, ...loader]
    } else {
      return [threadLoader, loader]
    }
  },
  assetsPath: _path => path.posix.join('static', _path),
  staticFileRuleUse: name => [{
    loader: 'url-loader',
    options: {
      limit: 4096,
      fallback: {
        loader: 'file-loader',
        options: {
          name: name
        }
      }
    }
  }],
  createNotifierCallback: () => {
    return (severity, errors) => {
      if (severity !== 'error') {
        return
      }
      const error = errors[0]
      const filename = error.file && error.file.split('!').pop()
      notifier.notify({
        title: pkg.name,
        message: severity + ': ' + error.name,
        subtitle: filename || ''
        // icon: path.join(__dirname, 'logo.png')
      })
    }
  }
}
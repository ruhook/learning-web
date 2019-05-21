# webpack 配置项之类的基础搭建 和 优化打包  （webpack-chain 链式 webpack 配置项）

## 一些简单原理

### compiler

Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例，可以通过 compiler 对象去操作webpack。   

compiler携带很多hooks，实现插件都是在于compiler的这些hooks

Webpack 通过实例化一个 Compiler 对象，然后调用它的 run 方法来开始一次完整的编译过程。

hooks
常用的就  compile  make compilation emit

```
'before run'
  'run'
    compile:func//调用compile函数
        'before compile'
           'compile'//(1)compiler对象的第一阶段
               newCompilation:object//创建compilation对象
               'make' //(2)compiler对象的第二阶段 
                    compilation.finish:func
                       "finish-modules"
                    compilation.seal
                         "seal"
                         "optimize"
                         "optimize-modules-basic"
                         "optimize-modules-advanced"
                         "optimize-modules"
                         "after-optimize-modules"//首先是优化模块
                         "optimize-chunks-basic"
                         "optimize-chunks"//然后是优化chunk
                         "optimize-chunks-advanced"
                         "after-optimize-chunks"
                         "optimize-tree"
                            "after-optimize-tree"
                            "should-record"
                            "revive-modules"
                            "optimize-module-order"
                            "advanced-optimize-module-order"
                            "before-module-ids"
                            "module-ids"//首先优化module-order，然后优化module-id
                            "optimize-module-ids"
                            "after-optimize-module-ids"
                            "revive-chunks"
                            "optimize-chunk-order"
                            "before-chunk-ids"//首先优化chunk-order，然后chunk-id
                            "optimize-chunk-ids"
                            "after-optimize-chunk-ids"
                            "record-modules"//record module然后record chunk
                            "record-chunks"
                            "before-hash"
                               compilation.createHash//func
                                 "chunk-hash"//webpack-md5-hash
                            "after-hash"
                            "record-hash"//before-hash/after-hash/record-hash
                            "before-module-assets"
                            "should-generate-chunk-assets"
                            "before-chunk-assets"
                            "additional-chunk-assets"
                            "record"
                            "additional-assets"
                                "optimize-chunk-assets"
                                   "after-optimize-chunk-assets"
                                   "optimize-assets"
                                      "after-optimize-assets"
                                      "need-additional-seal"
                                         unseal:func
                                           "unseal"
                                      "after-seal"
                    "after-compile"//(4)完成模块构建和编译过程(seal函数回调)    
    "emit"//(5)compile函数的回调,compiler开始输出assets，是改变assets最后机会
    "after-emit"//(6)文件产生完成
```

### Compilation

Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。


## loader

> 图片类

file-loader、url-loader（base64）、html-withimg-loader（html - img：src 替换）、extract-text-webpack-plugin（抽离 css）

> css 类

style-loader、css-loader（minimize[压缩]）、sass-resources-loader（sass 全局变量避免每个页面都需要引入）、postcss-loader（需要使用 autoprefixer 插件）

> js 类

babel-loader【AST(抽象语法树 Abstract Syntax Tree)】、babel-core、babel-preset-env、babel-preset-stage-0

## plugins

> html

html-webpack-plugin、clean-webpack-plugin

> 文件处理

copy-webpack-plugin（ src -> dist ）

> js

uglifyjs-webpack-plugin（压缩 js）

## watch

```
watchOptions:{
  ignored:/node_modules/,
  poll:1000,  // 轮询
  aggregateTimeout:500,  //
}
```

## 优化打包构建项

### 1、缩小文件搜索范围 

1.1 优化 loader 配置

```
module:{
  noParse:['vue.js'], // 不需要递归解析此文件，是编译过后的文件
  rules:[
    {
      test:/\.js?$/,
      use: [
        {loader:'babel-loader'}
      ],
      include: path.resolve('./src/),  // 只解析
      exclude: /node_modules/  // 不解析
    }
  ]
},
resolve:{
  alias:{
    vue: path.resolve('./vue/vue.pro.js')  // 模拟生产vue.js
  },
  extensions: ['.vue','.js','.json'],  //在导入语句没带文件后缀时，webpack会自动带上后缀去尝试访问文件是否存在。
  mainFields: ['es3js', 'browser', 'main'], // 有一些第三方模块会针对不同环境提供几份代码
  modules: ['./src/components','node_modules'],  // 检索模块

}
```

### 2、DLL（动态链接库）

DllPlugin 和 DllReferencePlugin 提供分离包的方式可以大大提高构建时间性能。主要思想在于，将一些不做修改的依赖文件，提前打包，这样我们开发代码发布的时候就不需要再对这部分代码进行打包。从而节省了打包时间。

```
module.exports = {
  entry:{
    react: ['react', 'react-dom']
  },
  output:{
    path:path.join(__dirname, 'dist'),
    filename:'[name]_dll.js',
    library:'_dll_[name]' // 全局变量名， 其他模块会从此变量上获取到里面的模块
  },
  plugins:[
    new webpack.DllPlugin({
      name:'_dll_[name]',
      manifest:path.join(__dirname, 'dist', 'manifest.json')
    })
  ]
}
```

```
plugins:{
  new webpack.DllReferencePlugin({
    manifest: path.join(__dirname, 'dist', 'manifest.json')
  })
}
```

### 3、HappyPack

分解给多个子进程(cpu.length - 1)去并发的执行，子进程处理完后再把结果发送给主进程。

> HappyPack 对 file-loader、url-loader 支持的不友好，所以不建议对该 loader 使用。

```
npm i happypack -D
```

```
const HappyPack = require('happypack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=babel',
        include: path.resolve('./src/),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'happypack/loader?id=css',
        include: path.resolve('./src/),
        exclude: /node_modules/
      },
    ]
  },
plugins: [
    new HappyPack({
      id: 'babel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }]
    }),
    new HappyPack({
      id: 'css',
      loaders: [{
        loader: ['style-loader', 'css-loader'],
      }]
    })
  ]
}
```

### 4、ParallelUglifyPlugin

替换自带的 UglifyJsPlugin， 把 js 压缩的单线程 转换成 多线程去压缩

```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

plugins: [
  new ParallelUglifyPlugin({
    workerCount: 3, // 开启几个子进程，默认是length -1
    uglifyJS:{
      output: {
        beautify: false, // 不需要格式化
        comments: false // 不保留注释
      },
      compress: {
        warnings: false,
        crop_console: true, // 删除项目中所有的console
      }
    }
  })
]
```

### 5、区分环境

process.env.NODE_ENV

production // 生产环境

development // 开发环境

全局变量配置

```
plugins:[
  new webpack.DefinePliugin({
    __dev__:JSON.stringify(process.env.NODE_ENV)
  })
]
```

1、通过 webpack 命令行 区分

```
{
  'bulid-p':'webpack --config webpack.production.config --mode production'
  'bulid-d':'webpack --config webpack.development.config --mode development'
}
```

2、通过文件划分 去组织 配置项

```
  < 三个文件 >
  webpack.base.config.js   // 基础配置
  webpack.dev.config.js    // 开发环境配置
  webpack.prod.config.js   // 生产环境配置

  < 主文件 >
  webpack.config.js

  webpack-merge // 合并webpack 配置项
  let merge = require('webpack-merge')
  module.exports = merge(base, _dev)
```

```
// cross-env包 为了兼容 window 之类的环境
{
  'bulid-p':'cross-env NODE_DEV=production && webpack --mode production'
  'bulid-d':'cross-env NODE_DEV=development && webpack --mode development'
}
```

### 6、服务器自动刷新

6.1 watch 文件修改就打包

6.2 热更新

```
plugins:[
  new webpack.HotModuleReplacement(),  
  new webpack.NamedModulePlugin(),
],
devServer:{
  hot: true,
  inline: true  // 在打包后的文件里注入一个websocket客户端
}
```

### 7、tree shaking
有点类似按需加载，没用到的不参与打包，减小项目体积

### 8、提取公共代码

#### chunks：
chunks属性用来选择分割哪些代码块，可选值有：'all'（所有代码块），'async'（按需加载的代码块），'initial'（初始化代码块）。

```
optimozation:{
  splitChunks:{

  }
}
```

### 9、开启scope hoisting

Scope Hoisting 它可以让webpack打包出来的代码文件更小，运行更快，它可以被称作为 "作用域提升"。

```
plugins: [
  // 开启 Scope Hoisting 功能
  new webpack.optimize.ModuleConcatenationPlugin()
]
```

### 10、代码分类

1、多个入口
2、防止重复，  splitChunks 切割代码



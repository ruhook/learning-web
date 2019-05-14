# webpack 学习笔记


## loader

> 图片类

file-loader、url-loader（base64）、html-withimg-loader（html - img：src 替换）、extract-text-webpack-plugin（抽离css）

> css类

style-loader、css-loader、sass-resources-loader（sass 全局变量避免每个页面都需要引入）、postcss-loader（需要使用autoprefixer插件）

> js类

babel-loader【AST(抽象语法树Abstract Syntax Tree)】、babel-core、babel-preset-env、babel-preset-stage-0
## plugins

> html

html-webpack-plugin、clean-webpack-plugin
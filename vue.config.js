/* jshint esversion: 6 */
'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '内容智能审读系统' // 标题

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  //解决部分插件未被编译为IE可识别的js
  // transpileDependencies: process.env.NODE_ENV === "development" ? ["*"] : ["*"],
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    port: 8081,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://10.120.65.77:8081`,
        target: `http://192.168.168.200:8081`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    devtool: process.env.NODE_ENV==="production"?false:"source-map",
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
}

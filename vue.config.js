const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_TITLE === 'test' ? '/dist/' : '/dist/'
  : '/dist/'
module.exports = {
  publicPath: BASE_URL,
  // 输出文件目录
  outputDir: 'dist',
  assetsDir: 'assets',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
        threshold: 10240,
        minRatio: 0.8,
      }))
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_debugger: true, // console
              drop_console: true, // 注释console
              pure_funcs: ['console.log'] // 移除console
            },
          },
          sourceMap: false,
          parallel: true,
        }),
      )
    }
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
        .pre()
        .exclude
          .add(/node_modules/)
          .add(require('path').dirname(require.resolve('@vue/cli-service')))
          .end()
      .test(/\.(vue|(j|t)sx?)$/)
      .use('eslint-loader')
        .loader('eslint-loader')
        .options({
        })
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))
  },
  // 打包时不生成.map文件
  productionSourceMap: true
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // ,devServer: {
  //   proxy: 'http://10.16.1.32:7300/mock/5c0a446e1b4b5a76b07c0ad1/bank-enterprise-admin'
  // }
}

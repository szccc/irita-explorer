const path = require('path') //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target:'http://localhost:3000',

        // bifrost
        // target:'https://bifrost.iobscan.io/api',

        // irisplorer
        target:'https://irishub.iobscan.io/api',
        
        // target: 'http://192.168.150.60:31751/api/',

        // stargate online
        // target:'https://stargate.iobscan.io/api',


        // target:'https://cosmoshub.iobscan.io/api',

        // nyancat online
        // target:'https://nyancat.iobscan.io/api',

        // dev
        // target:'http://192.168.150.31:3000',
        
        // QA bifrost
        // target:'http://10.2.10.140:3000',

        // new Qa 
        // target: 'http://192.168.150.60:32586',

        // qa irishub v1.0.0
        // target:'http://192.168.150.60:3000',
        
        // QA CSchain
        // target:'http://10.2.10.130:3000',
        secure: false,
        pathRewrite: { '^/api': '/' },
      },
      '/lcd': {
        // cosmos_hub online
        // target: 'http://35.189.185.60:1317',
        
        // bifrost dev
        target: 'http://192.168.150.31:51317',

        // nyancat online
        // target: 'http://34.80.202.172:1317/',

        // stargate online
        // target: 'http://34.80.22.255:1317/',

        // stargate/cosmosHub dev
        //  target: 'http://192.168.150.34:51317',

        //  qa bifrost
        // target: 'http://10.2.10.140:11317',

        // cschain-dev
        // target: 'http://10.0.1.116:1317',
        secure: false,
        pathRewrite: { '^/lcd': '/' },
      }
    },
  },
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('./src'))
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/variable.scss";@import "@/style/productization.scss";`,
      },
    },
  },
}
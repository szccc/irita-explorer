module.exports = {
    devServer: {
        proxy: {
          '/api':{
             	target:'http://10.1.4.248:3000',
            	secure:false,
            	pathRewrite:{'^/api': '/'}
          },
          '/lcd':{
              	target:'http://10.2.10.130:2317',
            	secure:false,
            	pathRewrite:{'^/lcd': '/'}
          }
        }
    },
    lintOnSave:false,
}
module.exports = {
	devServer: {
		proxy: {
			'/api':{
                target:'http://10.2.10.130:2317',
				secure:false,
				pathRewrite: {
			     '^/api': ''
			    }
			}
		},
		disableHostCheck: true
	},
	lintOnSave:false,
}

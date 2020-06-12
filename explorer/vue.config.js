module.exports = {
	devServer: {
		proxy: {
			'/api':{
				target:'http://10.2.10.130:3000',
				secure:true,
				pathRewrite: {
		     '^/api': ''
		    }
			}
		},
		disableHostCheck: true
	},
	lintOnSave:false,
}

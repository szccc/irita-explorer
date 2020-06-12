module.exports = {
	devServer: {
		proxy: {
			'/api':{
				target:'http://192.168.150.32:2317',
				secure:false,
			}
		},
		disableHostCheck: true
	},
	lintOnSave:false,
}

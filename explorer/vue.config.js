module.exports = {
	devServer: {
		proxy: {
			'/api':{
				target:'http://0.0.0.0:3001',
				secure:false,
			}
		},
		disableHostCheck: true
	},
	lintOnSave:false,
}

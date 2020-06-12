module.exports = {
	devServer: {
		proxy: {
			'/api':{
				target:'http://localhost:3001',
				secure:false,
			}
		},
		disableHostCheck: true
	},
	lintOnSave:false,
}

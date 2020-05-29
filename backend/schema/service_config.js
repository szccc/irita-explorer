const mongoose = require('mongoose')
const serviceConfig = new mongoose.Schema({
	height:Number
})
let serviceConfigModel = mongoose.model('service_config',serviceConfig,'service_config')
module.exports = serviceConfigModel

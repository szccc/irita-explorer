const mongoose = require('mongoose')
const validatorList = new mongoose.Schema({
	address: String,
	pub_key: String,
	proposer_priority: String,
	voting_power: String,
	create_time:String,
	update_time:String
})
validatorList.index({address: 1}, {unique: true});
let validatorListModel = mongoose.model('validator_list',validatorList,'validator_list')
module.exports = validatorListModel

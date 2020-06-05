const mongoose = require('mongoose')


const serviceTxList = new mongoose.Schema({
	height: Number,
	tx_hash: {type:String,unique:true,dropDups: true},
	memo: String,
	time: Date,
	type: String,
	from: String,
	To: String,
	status:Number,
	coins:{
		denom:String,
		amount:String
	},
	events:Array,
	msgs:Array,
	signers:Array,
	signer:String,
	"txn-revno": Number,
	"txn-queue": Array
})
serviceTxList.index({name: 1, nft_id: 1}, {unique: true});
let serviceTxListModel = mongoose.model('service_tx',serviceTxList,'service_tx')
module.exports = serviceTxListModel

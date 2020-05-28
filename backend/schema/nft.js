const mongoose = require('mongoose')
const nft = new mongoose.Schema({
    nft_id: String,
    onwer: String,
    token_uri: String,
    token_data: String,
    name: String,
    primary_key: {type:String, unique:true,dropDups: true},
})
let nftModel = mongoose.model('sync_list',nft,'sync_nft')

module.exports = nftModel

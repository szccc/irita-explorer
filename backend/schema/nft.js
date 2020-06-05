const mongoose = require('mongoose')
const nft = new mongoose.Schema({
    nft_id: String,
    owner: String,
    token_uri: String,
    token_data: String,
    name: String,
    create_time :String,
    update_time : String
});
nft.index({name: 1, nft_id: 1}, {unique: true});
let nftModel = mongoose.model('sync_list',nft,'sync_nft')

module.exports = nftModel

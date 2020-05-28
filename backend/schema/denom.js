const mongoose = require('mongoose')
const denom = new mongoose.Schema({
    name: {type:String, unique:true,dropDups: true},
    json_schema: String,
    creator: String
})
let denomModel = mongoose.model('denom_list',denom,'sync_denom')

module.exports = denomModel



var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');

router.get('/',(req,res,next) => {
	let getOwnerAddressUrl = `${config.lcdAddress}/nft/owner/${req.query.owner}`;
	request(getOwnerAddressUrl,(error,response,body) => {
		if(error){
			throw error
		}else {
			if(body){
				let resultData = JSON.parse(body);
				if(resultData.result && resultData.result.value){
					res.send(resultData.result.value)
				}
			}
		}
	})
})

module.exports = router;

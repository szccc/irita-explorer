var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');

router.get('/',(req,res,next) => {
	let nftListUrl = `${config.lcdAddress}/nft/denoms`
	request(nftListUrl,(error,response,body) => {
		if(error){
			throw error
		}else {
			if(body){
				let resData = JSON.parse(body);
				if(resData.result){
					res.send(resData.result)
					
				}
			}
		}
	})
})



module.exports = router;

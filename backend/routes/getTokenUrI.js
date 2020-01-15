var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');

router.get('/',(req,res,next) => {
	let getTokenUrIUrl = `${config.lcdAddress}/nft/collection/${encodeURIComponent(req.query.denom)}/nft/${encodeURIComponent(req.query.tokenId)}`,data;
	request(getTokenUrIUrl,(error,respons,body) => {
		if(error){
			throw  error
		}else {
			if(body){
				let resultData = JSON.parse(body);
				data = resultData.result.value;
				res.send(data)
			}
		}
	})
});


module.exports = router;

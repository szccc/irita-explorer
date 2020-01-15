var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');


router.get('/',(req,res,next) => {
	let lcdValidatorListUrl = `${config.lcdAddress}/staking/validators?status=${req.query.status}&page=${req.query.page}&limit=${req.query.size}`;
	request(lcdValidatorListUrl,(error,response,body) => {
		if(error) {
			throw error
		}else {
			if(response){
				res.send(JSON.parse(body))
			}
		}
		
	})
});

module.exports = router;

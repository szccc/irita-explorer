var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');

router.get('/',(req,res,next) => {
	let getServiceBindingListUrl = `${config.lcdAddress}/service/bindings/${req.query.serviceName}`,data;
	request(getServiceBindingListUrl,(error,response,body) => {
		if(error){
			throw error
		}else {
			if(body){
				let resultData = JSON.parse(body);
				data = resultData.result;
			}
		}
		res.send(data)
	})
});




module.exports = router;

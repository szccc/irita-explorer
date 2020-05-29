const express = require('express');
const router = express.Router();
const serviceTxListModel = require('../schema/serviceTx')
router.get('/',(req,res,next) => {
	let sqFind = {'msgs.msg.name':req.query.serviceName}
	serviceTxListModel.find(sqFind).then(serviceInform => {
		res.send(serviceInform[0].msgs[0].msg)
	}).catch(error => {
		res.send(error)
	})
	
	
	/*let getServiceDefinitionsUrl = `${config.lcdAddress}/service/definitions/${req.query.serviceName}`,data;
	request(getServiceDefinitionsUrl,(error,response,body) => {
		if(error){
			throw error
		}else {
			if(body){
				let resultData = JSON.parse(body);
				data = resultData.result;
			}
		}
		res.send(data)
	})*/
});


module.exports = router;

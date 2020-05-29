const express = require('express');
const router = express.Router();
const txListModel = require('../schema/tx');

router.get('/',(req,res,next) => {
	let sqFind = {
		'$and':[
			{'msgs.msg.id':{'$regex':req.query.tokenId,'$options':'i'}},
			{'msgs.msg.denom':{'$regex':req.query.denom,'$options':'i'}}
		],
	}
	
	txListModel.find(sqFind).then(result => {
		res.send(result)
	})
})







module.exports = router;

const express = require('express');
const router = express.Router();
const txListModel = require('../schema/tx');

router.get('/',(req,res,next) => {
	let sqFind = {'msgs.msg.id':req.query.tokenId}
	txListModel.find(sqFind).then(result => {
		res.send(result)
	})
})







module.exports = router;

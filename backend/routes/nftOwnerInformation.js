const express = require('express');
const router = express.Router();
const nftMode = require('../schema/nft');

router.get('/',(req,res,next) => {
	nftMode.find({owner:req.query.owner}).then(result => {
		res.send(result)
	}).catch(error => {
		res.send(error)
	})
})

module.exports = router;

const express = require('express');
const router = express.Router();
const denomModel = require('../schema/denom');

router.get('/',(req,res,next) => {
	let sqFind = {};
	
	if(req.query.denom){
		sqFind['$and'] = [{
				name : encodeURIComponent(req.query.denom),
			}
		]
	}
	denomModel
	.aggregate(
		[
			{
				$lookup : {
					from : "sync_nft",
					localField : "name",
					foreignField : "name",
					as : "nft"
				}
			},{
			$match:sqFind
		}
		]).then(result =>{
		result.filter( item => {
			if(item.nft && item.nft.length > 1){
				item.nft = item.nft.filter( item => {
					return item.nft_id === req.query.tokenId
				})
			}
		})
		res.send(result)
	}).catch(err =>{
		console.error('query denoms error:', err)
		res.send(err)
	});
	/*let getTokenUrIUrl = `${config.lcdAddress}/nft/nets/collection/${encodeURIComponent(req.query.denom)}/${encodeURIComponent(req.query.tokenId)}`,data;
	request(getTokenUrIUrl,(error,respons,body) => {
		if(error){
			throw  error
		}else {
			if(body){
				let resultData = JSON.parse(body);
				if(resultData.result && resultData.result.value){
					data = resultData.result.value;
					res.send(data)
				}else {
					res.send({
						code:'EX-100000',
						msg:'not found result'
					})
				}
				
			}
		}
	})*/
});


module.exports = router;

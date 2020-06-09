const express = require('express');
const router = express.Router();
const serviceTxListModel = require('../schema/serviceTx');
router.get('/',(req,res,next) => {
	
	let getServiceListCount = new Promise((resolve, reject) => {
		serviceTxListModel.count().then(count => {
			resolve(count)
		}).catch(err => {
			reject(err)
		})
	})
	getServiceListCount.then(count => {
	
		serviceTxListModel.find(sqFind).then( serviceList => {
			let Data = []
			Data = serviceList.map(item => {
				return {
					txHash: item.tx_hash,
					from: item.from,
					status: item.status === 1 ? 'success' : 'failed',
					msgs: item.msgs
				}
			})
			res.send({
				count: count,
				data: Data
			});
		})
	})
})



module.exports = router;

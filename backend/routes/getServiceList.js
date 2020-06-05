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
		serviceTxListModel.find({}).then( serviceList => {
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
	/*MongoClient.connect(mongoUrl.mongoUrl,{ useUnifiedTopology: true,useNewUrlParser : true },(err,db) => {
		if (err) throw err;
		let iritaExplorerDb = db.db('csrb');
		let Data = [],countNumber;
		iritaExplorerDb.collection('service_tx').find().count((err,result) => {
			if (err) throw err;
			if(result) {
				countNumber = result
			}
		});
		iritaExplorerDb.collection('service_tx').find({}).skip((Number(req.query.page) - 1)*Number(req.query.size)).limit(Number(req.query.size)).toArray((err,result) => {
			if (err) throw err;
			if(result){
				Data = result
				Data = result.map(item => {
					return {
						txHash: item.tx_hash,
						from: item.from,
						status: item.status === 1 ? 'success' : 'failed',
						msgs: item.msgs
					}
				});
			}
			res.send({
				count: countNumber,
				data: Data
			});
			db.close();
		})
	})*/
})



module.exports = router;

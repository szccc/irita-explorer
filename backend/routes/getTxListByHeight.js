var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl,{ useUnifiedTopology: true,useNewUrlParser : true },(err,db) => {
		if(err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = [],countNumber;
		iritaExplorerDb.collection('sync_tx').find({'height':Number(req.query.height)}).count((err,result) => {
			if (err) throw err;
			if(result) {
				countNumber = result
			}
		});
		iritaExplorerDb.collection('sync_tx').find({'height':Number(req.query.height)}).toArray( (err,result) => {
			if(err) throw err;
			if(result){
				Data = result.map(item => {
					return {
						txHash: item.tx_hash,
						height: item.height,
						txType: item.type,
						from: item.from,
						to: item.to,
						signer: item.signer,
						status: item.status === 1 ? 'success' : 'failed',
						timestamp: item.time
					}
					
				});
			}else {
				Data = [];
			}
			res.send({
				count: countNumber,
				data: Data
			});
			db.close();
		})
	})
	
})


module.exports = router;

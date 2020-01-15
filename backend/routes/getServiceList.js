var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/',(req,res,next) => {
	
	MongoClient.connect(mongoUrl.mongoUrl,{ useUnifiedTopology: true,useNewUrlParser : true },(err,db) => {
		if (err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
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
	})
})



module.exports = router;

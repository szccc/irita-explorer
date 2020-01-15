var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
		if (err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = [],countNumber;
		iritaExplorerDb.collection('sync_tx').find({}).count((err,result) => {
			if (err) throw err;
			if(result) {
				countNumber = result
			}
		});
		let sqFind = {} ;
		if(req.query.txType === "" && req.query.status === '' && req.query.beginTime === "" && req.query.endTime === "") {
		
		}else {
			
			sqFind['$and'] = [];
			if(req.query.txType && req.query.txType !== ""){
				sqFind['$and'].push({
					type: req.query.txType
				})
			}
			if(req.query.status === 'fail'){
				sqFind['$and'].push({
					status:0
				})
			}
			if(req.query.beginTime && req.query.beginTime !== "" || req.query.endTime && req.query.endTime !== ""){
				sqFind['$and'].push({
					time: {
						'$gte' : req.query.beginTime ? new Date(req.query.beginTime * 1000) : new Date(0),
						'$lte' : req.query.endTime ? new Date(req.query.endTime * 1000) : new Date()
					}
				})
			}
		}
		iritaExplorerDb.collection('sync_tx').find(sqFind).skip((Number(req.query.page) - 1)*Number(req.query.size)).sort({height: -1}).limit(Number(req.query.size)).toArray((err, result) => {
			if (err) throw err;
			if (result) {
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
			} else {
				result = null;
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

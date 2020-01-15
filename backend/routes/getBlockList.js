var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;



router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
		if (err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = [],countNumber;
		iritaExplorerDb.collection('sync_block').find().count((err,result) => {
			if (err) throw err;
			if(result) {
				countNumber = result
			}
		});
		iritaExplorerDb.collection('sync_block').find().skip((Number(req.query.page) - 1)*Number(req.query.size)).sort({height: -1}).limit(Number(req.query.size)).toArray((err, result) => {
			if (err) throw err;
			if (result) {
				Data = result.map(item => {
					return {
						height: item.height,
						timestamp: item.time,
						numTxs: item.txn
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

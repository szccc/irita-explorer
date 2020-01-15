var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = require('../config/index')
router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
		if (err) throw err;
		let iritaExplorerDb = db.db('irita-explorer'),data,countNumber;
		let sqFind= {
			'$and':[
				{
					'msgs.msg.name':req.query.serviceName
				},
				{
					'msgs.msg.chain_id':req.query.chainId
				},
			]
		};
		iritaExplorerDb.collection('sync_tx').find(sqFind).count((err,result) => {
			if (err) throw err;
			if(result) {
				countNumber = result
			}
		});
		iritaExplorerDb.collection('sync_tx').find(sqFind).toArray((error,result) => {
			if(error) throw error;
			if(result){
				data = result.map(item => {
					return {
						tx_hash: item.tx_hash,
						msgs: item.msgs,
						from: item.from,
						status: item.status === 1 ? 'success' : 'failed',
						height:item.height,
						txType: item.type,
						to: item.to,
						time: item.time
					}
				});
			}
			res.send({
				count:countNumber,
				data: data
			})
			db.close()
		})
	})
})




module.exports = router;

var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl,{ useUnifiedTopology: true,useNewUrlParser : true },(err,db) => {
		if(err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = null;
		let sqFind = {
			tx_hash:req.query.txhash
		}
		iritaExplorerDb.collection('sync_tx').find(sqFind).toArray((err,result) => {
			if(err) throw err;
			if(result && result.length > 0){
				Data = {
					txHash: result[0].tx_hash,
					block_height: result[0].height,
					status : result[0].status === 1 ? 'success' : 'fail',
					timestamp : result[0].time,
					signer : result[0].signer,
					memo : result[0].memo,
					msgs : result[0].msgs,
				}
			}else {
				result = null;
			}
			res.send(Data);
			db.close();
		})
	})
	
})

module.exports = router;


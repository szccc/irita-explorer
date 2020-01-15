var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl,{ useUnifiedTopology: true,useNewUrlParser : true },(err,db) => {
		if(err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = [];
		iritaExplorerDb.collection('sync_tx').find({}).sort({time:-1}).limit(10).toArray( (err,result) => {
			if(err) throw err;
			if(result){
				Data = result
				Data = result.map(item => {
					return {
						hash: item.tx_hash,
						timestamp: item.time,
						txType:item.type
					}
					
				});
			}else {
				result = null;
			}
			res.send(Data);
			db.close();
		})
	})
})


module.exports = router;

var express = require('express');
var router = express.Router();
var mongoUrl = require('../config/index')
var MongoClient = require('mongodb').MongoClient;

router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl,{ useUnifiedTopology: true,useNewUrlParser : true },(err,db) => {
		if(err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = [],countNumber,sqFind = {} ;
		if(req.query.denom === '' && req.query.owner === '' && req.query.tokenId === ''){

		}else {
			sqFind['$and'] = [];
			if(req.query.denom){
				sqFind['$and'].push({
					denom: req.query.denom
				})
			}
			if(req.query.owner){
				sqFind['$and'].push({
					owner: req.query.owner
				})
			}
			if(req.query.tokenId){
				sqFind['$and'].push({
					tokenId: req.query.tokenId
				})
			}
		}
		iritaExplorerDb.collection('asset_list').find(sqFind).count((err,result) => {
			if(err) throw err;
			if(result){
				countNumber = result;
			}
		iritaExplorerDb.collection('asset_list').find(sqFind).skip((Number(req.query.page) - 1)*Number(req.query.size)).limit(Number(req.query.size)).toArray((err, result) => {
			if (err) throw err;
			if(result){
				result.forEach( item => {
					Data.unshift({
						denom:item.denom,
						owner: item.owner,
						tokenId: item.tokenId,
						tokenUri: item.tokenUri
					})
				}) ;
				res.send({
					count: countNumber,
					data: Data
				});
				db.close();
				}
			})
		})
	})
});

module.exports = router;

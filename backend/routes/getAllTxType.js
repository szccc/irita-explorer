var mongoUrl = require('../config/index')
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


router.get('/',(req,res,next) => {
	MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
		if (err) throw err;
		let iritaExplorerDb = db.db('irita-explorer');
		let Data = [],txTypeArr = [];
		iritaExplorerDb.collection('sync_tx').find().toArray((err, result) => {
			if (err) throw err;
			if (result) {
				result.forEach(item => {
					txTypeArr.unshift(item.type)
				});
				Data = [...new Set(txTypeArr)]
			}
			res.send(Data);
			db.close();
		})
	})
})
module.exports = router;

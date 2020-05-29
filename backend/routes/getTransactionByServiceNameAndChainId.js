const express = require('express');
const router = express.Router();
const txListModel = require('../schema/tx')
router.get('/',(req,res,next) => {
	let sqFind= {
		"$or":[
			{
				"$and":[
					{
						'msgs.msg.name':req.query.serviceName
					},
					{
						'msgs.type':'define_service'
					}
				],
			},
			{
				"$and":[
					{
						'msgs.msg.name':req.query.serviceName
					},
					{
						'msgs.type':'request_service'
					}
				],
			},
			{
				"$and":[
					{
						'msgs.msg.name':req.query.serviceName
					},
					{
						'msgs.type':'bind_service'
					}
				],
			},
		]
	};
	let getCountPromist = new Promise((resolve, reject) => {
		txListModel.count(sqFind).then(count => {
			resolve(count)
		}).catch(err => {
			reject(err)
		})
	})
	getCountPromist.then(count => {
		txListModel.find(sqFind).skip((Number(req.query.page) - 1)*Number(req.query.size)).sort({height: -1}).limit(Number(req.query.size)).then(result => {
			let Data = []
			Data = result.map(item => {
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
			res.send({
				count:count,
				data: Data
			})
		})
	})
	
	
	// MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
	// 	if (err) throw err;
	// 	let iritaExplorerDb = db.db('csrb'),data,countNumber;
	// 	let sqFind= {
	// 		"$or":[
	// 			{
	// 				"$and":[
	// 					{
	// 						'msgs.msg.name':req.query.serviceName
	// 					},
	// 					{
	// 						'type':'service_define'
	// 					}
	// 				],
	// 			},
	// 			{
	// 				"$and":[
	// 					{
	// 						'msgs.msg.def_name':req.query.serviceName
	// 					},
	// 					{
	// 						'type':'service_request'
	// 					}
	// 				],
	// 			},
	// 			{
	// 				"$and":[
	// 					{
	// 						'msgs.msg.def_name':req.query.serviceName
	// 					},
	// 					{
	// 						'type':'service_bind'
	// 					}
	// 				],
	// 			},
	// 		]
	// 	};
	// 	iritaExplorerDb.collection('sync_tx').find(sqFind).count((err,result) => {
	// 		if (err) throw err;
	// 		if(result) {
	// 			countNumber = result;
	// 			iritaExplorerDb.collection('sync_tx').find(sqFind).skip((Number(req.query.page) - 1)*Number(req.query.size)).sort({height: -1}).limit(Number(req.query.size)).toArray((error,result) => {
	// 				if(error) throw error;
	// 				if(result){
	// 					data = result.map(item => {
	// 						return {
	// 							tx_hash: item.tx_hash,
	// 							msgs: item.msgs,
	// 							from: item.from,
	// 							status: item.status === 1 ? 'success' : 'failed',
	// 							height:item.height,
	// 							txType: item.type,
	// 							to: item.to,
	// 							time: item.time
	// 						}
	// 					});
	// 				}
	// 				res.send({
	// 					count:countNumber,
	// 					data: data
	// 				})
	// 				db.close()
	// 			})
	// 		}
	// 	});
	//
	// })
})




module.exports = router;

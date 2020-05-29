var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');
var mongoUrl = require('../config/index')
var MongoClient = require('mongodb').MongoClient;
const blockModel = require('../schema/blockList')
const transactionModel = require('../schema/tx')
const validatorModel = require('../schema/validator')
const serviceModel = require('../schema/serviceTx')
const nftAssetModel = require('../schema/nft')
router.get('/',(req,res,next) => {
	let differenceBlock = 100;
	let countAllPromise = new Promise((resolve, reject) => {
		blockModel.findOne({}).sort({height: -1}).then(result => {
			let diffBlock = Number(result.height) - differenceBlock
			blockModel.findOne({height: diffBlock}).then(diffBlock => {
				if(result.time && diffBlock.time){
					let diffBlockTime = Number(new Date(result.time).getTime()) - Number(new Date(diffBlock.time).getTime())
					let ageTime = (diffBlockTime / 1000 / differenceBlock).toFixed(2)
					resolve({
						height:result.height,
						age_time: ageTime,
						last_height_time: new Date(result.time).toISOString()
					})
				}else {
					resolve({
						height:result.height,
						age_time: '',
						ast_height_time: ''
					})
				}
				
				
			})
		}).catch(err => {
			reject(err)
		})
	})
	countAllPromise.then(lastHeight => {
		transactionModel.count('_id').then(txCount => {
			validatorModel.count('_id').then(validatorCount => {
				serviceModel.count('_id').then(serviceCount => {
					nftAssetModel.count('nft_id').then(nftCount => {
						res.send({
							height: lastHeight.height,
							ageTime: lastHeight.age_time,
							txCount: txCount,
							validatorCount: validatorCount,
							serviceCount: serviceCount,
							nftCount: nftCount,
							timestamp:lastHeight.last_height_time
						})
					})
					
				})
			})
		}).catch(err => {
			throw err
		})
	}).catch(err => {
		res.send(err)
	})
	
	
	// let lcdBlockLatestHeightURL = `${config.lcdAddress}/blocks/latest`;
	// let lcdBlockHeightUrl = `${config.lcdAddress}/blocks/`;
	/*request(lcdBlockLatestHeightURL,(error,response,body) => {
		var responseData = {
				block_height: null,
				block_time: null,
				totals_txs: 0,
				address_number: 0,
				server_number: 0,
				validator_number:0,
				asset_number: 0,
				diffBlockTime:0
		    };
		if(error){
			throw error
		}else {
			if(body && !JSON.parse(body).error){
				let resData = JSON.parse(body);
				let differenceBlock = 100;
				if(resData.block){
					responseData.block_height = resData.block.header.height;
					responseData.block_time = resData.block.header.time;
					let diffBlockUrl = `${lcdBlockHeightUrl}${Number(responseData.block_height) - differenceBlock}`;
					let getValidatorNumberUrl = `${config.lcdAddress}/validatorsets/latest`;
					request(diffBlockUrl,(error,response,body) => {
						if(error){
							throw error
						}else {
							if(body){
								let diffResponseData = JSON.parse(body);
								if(diffResponseData.block){
									responseData.diffBlockTime = diffResponseData.block.header.time
								}
							}
							request(getValidatorNumberUrl,(error,response,body) => {
								if(error){
									throw error
								}else {
									if(body){
										let resultData = JSON.parse(body);
										if(resultData.result.validators){
											responseData.validator_number = resultData.result.validators.length
										}
									}
								}
								MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
									let iritaExplorerDb = db.db('csrb');
									iritaExplorerDb.collection('sync_tx').find({}).count((err,result) => {
										if (err) throw err;
										if (result) {
											responseData.totals_txs = result;
										}
									});
									iritaExplorerDb.collection('service_tx').find().count((err,result) => {
										if (err) throw err;
										if(result) {
											responseData.server_number = result
										}
									});
									iritaExplorerDb.collection('asset_list').find({}).count((err,result) => {
										if(err) throw err;
										if(result){
											responseData.asset_number = result;
										}
										res.send(responseData)
									});
								});
							})
						}
					})
				}
			}
		}
	})*/
});


module.exports = router;

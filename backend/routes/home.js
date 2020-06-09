var express = require('express');
var router = express.Router();
var config = require('../config/index');
var request = require('request');
var mongoUrl = require('../config/index')
var MongoClient = require('mongodb').MongoClient;
const blockModel = require('../schema/blockList')
const transactionModel = require('../schema/tx')
const validatorModel = require('../schema/validator')
const nftAssetModel = require('../schema/nft')
const serviceModel = require('../schema/serviceTx')
router.get('/',(req,res,next) => {
	let differenceBlock = 100;
	function getLastHeight() {
		return new Promise((resolve, reject) => {
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
	}
	function getTransactionCount ( ) {
		return new Promise( (resolve, reject) => {
			transactionModel.count().then(txCount => {
				resolve(txCount)
			})
		})
	}
	function getValidatorCount() {
		return new Promise( (resolve, reject) => {
			validatorModel.count().then(validatorCount => {
				resolve(validatorCount)
			})
		} )
	}
	function getServiceCount() {
		return new Promise( (resolve, reject) => {
			serviceModel.count().then(serviceCountNumber => {
				resolve(serviceCountNumber)
			})
		})
	}
	function getNftCount() {
		return new  Promise((resolve, reject) => {
			nftAssetModel.count().then(nftCount =>{
				resolve(nftCount)
			})
		})
	}
	async function getAllCount() {
		let lastHeight = await getLastHeight();
		let txCount = await getTransactionCount();
		let validatorCount = await getValidatorCount();
		let serviceCount  = await getServiceCount();
		let nftCount = await getNftCount();
		res.send({
			height: lastHeight.height,
			ageTime: lastHeight.age_time,
			txCount: txCount,
			validatorCount: validatorCount,
			serviceCount: serviceCount,
			nftCount: nftCount,
			timestamp:lastHeight.last_height_time
		})
	}
	getAllCount()
});


module.exports = router;

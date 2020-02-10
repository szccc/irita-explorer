var express = require('express');
var config = require('../config/index');
var mongoUrl = require('../config/index')
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var nftListUrl = `${config.lcdAddress}/nft/denoms`;
let getDenomInformationUrl = `${config.lcdAddress}/nft/collection/`;
const schedule = require('node-schedule');
var denomArray;
const  scheduleCronstyle = () => {
	MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
		let iritaExplorerDb = db.db('irita-explorer');
		iritaExplorerDb.createCollection('asset_list');
	});
	schedule.scheduleJob(mongoUrl.syncServiceTime,() => {
		console.log("资产数量定时更新中")
		request(nftListUrl,(error,response,body) => {
			if(error){
				throw error
			}else {
				if(body){
					let resultData = JSON.parse(body).result;
					denomArray = resultData;
					resultData.forEach( item => {
						request(`${getDenomInformationUrl}${encodeURIComponent(item)}`,(error,response,body) => {
							if(error)throw error;
							if(body){
								let resultData = JSON.parse(body);
								let denomName = item,data = resultData.result[item];
								MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
									let iritaExplorerDb = db.db('irita-explorer');
									iritaExplorerDb.collection('asset_list').find({}).toArray((err,result) => {
										if(err) throw err;
										if(result && result.length > 0){
											for(let tokenID in resultData.result[item].nfts){
												MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
													let iritaExplorerDb = db.db('irita-explorer');
													iritaExplorerDb.collection('asset_list').updateOne({
														denom:`${denomName}`,
														tokenId:`${tokenID}`
													},{$set:{
															denom: denomName,
															tokenId: tokenID,
															owner:data.nfts[tokenID].owner,
															tokenUri:data.nfts[tokenID].token_uri
														}
													},{upsert:true})
												})
											}
										}else {
											for(let tokenID in resultData.result[item].nfts){
												MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
													let iritaExplorerDb = db.db('irita-explorer');
													iritaExplorerDb.collection('asset_list').insertOne({
														denom: denomName,
														tokenId: tokenID,
														owner: data.nfts[tokenID].owner,
														tokenUri:data.nfts[tokenID].token_uri
													})
												})
											}
										}
									})
								})
							}
						})
					})
				}
			}
		})
	})
}
scheduleCronstyle();




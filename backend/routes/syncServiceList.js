const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const router = express.Router();
const serviceTxListModel = require('../schema/serviceTx');
const serviceConfigModel = require('../schema/service_config');
const txListModel = require('../schema/tx')
const schedule = require('node-schedule');
const mongoUrl = require('../config/index')
const  scheduleCronstyle = () => {
	console.log('定时任务启动')
	schedule.scheduleJob(mongoUrl.syncServiceTime,() => {
		console.log("定时更新执行中")
		let getServiceConfigHeight = new Promise((resolve, reject) => {
			serviceConfigModel.findOne({}).then( result => {
				if(result){
					resolve(result.height)
				}else {
					resolve(1)
				}
			}).catch(error => {
				resolve(1)
			})
		})
		getServiceConfigHeight.then(resultHeight => {
			if(resultHeight){
				let sqFind= {
					'$and':[
						{
							type: 'define_service'
						},
						{
							height:{
								'$gt':resultHeight
							}
						}
					]
				}
				txListModel.find(sqFind).sort({height: -1}).then(result => {
					serviceConfigModel.updateOne({
						height:resultHeight
					},{$set:result[0].height},{upsert:true})
					serviceTxListModel.insertMany(result,function (err) {
						if(err){
							console.error('insert nft failed!',err.errmsg);
						} else{
							console.log('insert service tx successfully!');
						}
					})
				})
			}}).catch(err => {
				throw err
		})
	})
}
scheduleCronstyle();

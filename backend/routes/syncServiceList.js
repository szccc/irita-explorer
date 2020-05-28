var mongoUrl = require('../config/index')
var MongoClient = require('mongodb').MongoClient;
const schedule = require('node-schedule');
const  scheduleCronstyle = () => {
	console.log('定时任务启动')
	schedule.scheduleJob(mongoUrl.syncServiceTime,() => {
		console.log("定时更新执行中")
		MongoClient.connect(mongoUrl.mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
			if (err) throw err;
			let iritaExplorerDb = db.db('irita-explorer'),sqFindHeight;
			iritaExplorerDb.createCollection('service_config');
			iritaExplorerDb.createCollection('service_tx');
			//查询config高度
			iritaExplorerDb.collection('service_config').find({}).toArray((error,result) => {
				if(error) throw error;
				//查询config高度不为0
				if(result && result.length !== 0){
					let sqFindHeight = result[0].height;
					//设置查询条件，通过type跟大于上次插入的高度查询最新的service交易
					iritaExplorerDb.collection('sync_tx').find({
						'$and':[
							{
								type: 'service_define'
							},
							{
								height:{
									'$gt':sqFindHeight
								}
							}
						]
					}).toArray((error,res) =>{
						if(error) throw  error;
						//查询到如果有新的交易产生，循环去重插入数据。
						if(res && res.length !== 0){
							let newData = [];
							newData = res.map(item => {
								return {
									_id:item.tx_hash,
									tx_hash: item.tx_hash,
									msgs: item.msgs,
									from: item.from,
									status: item.status,
								}
							});
							newData.forEach(item => {
								iritaExplorerDb.collection('service_tx').updateOne({_id:item.tx_hash},{$set:item},{upsert:true})
							});
							iritaExplorerDb.collection('service_config').updateOne(
								{height:sqFindHeight},{$set:{height:res[0].height},},{upsert:true})
						}
					})
				}else {
					//没有查询到config高度，只通过type查询并插入数据
					let sqFind = {
						type:'service_define'
					}
					iritaExplorerDb.collection('sync_tx').find(sqFind).toArray((error,syncTxResult) => {
						if (error) throw error;
						//查询到有service交易
						if(syncTxResult && syncTxResult.length !== 0){
							let data = [];
							//设置_id为hash,方便去重插入
							data = syncTxResult.map(item => {
								return {
									_id:item.tx_hash,
									tx_hash: item.tx_hash,
									msgs: item.msgs,
									from: item.from,
									status: item.status,
								}
							});
							//查询是否有service交易
							iritaExplorerDb.collection('service_tx').find({}).toArray((error,res) => {
								if (error) throw error;
								//查询到如有之前表里有service交易，就通过_id去更新数据，没有就批量插入
								if(res && res.length !== 0){
									data.forEach(item => {
										iritaExplorerDb.collection('service_tx').updateOne({_id:item.tx_hash},{$set:item},{upsert:true})
									})
								}else {
									iritaExplorerDb.collection('service_tx').insertMany(data);
								}
							});
							//设置插入交易列表的最新交易的高度
							if(syncTxResult[0].height){
								iritaExplorerDb.collection('service_config').insertOne({
									height:syncTxResult[0].height
								})
							}
						}
					})
				}
			})
		})
	})
}
scheduleCronstyle();

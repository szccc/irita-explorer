const serviceTxListModel = require('../schema/serviceTx');
const txListModel = require('../schema/tx')
const schedule = require('node-schedule');
const mongoUrl = require('../config/index')
const  scheduleCronstyle = () => {
	console.log('定时任务启动')
	schedule.scheduleJob(mongoUrl.syncServiceTime,() => {
		console.log("定时更新执行中")
		let getServiceConfigHeight = new Promise((resolve, reject) => {
			serviceTxListModel.findOne({}).then( result => {
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
						},
					]
				}
				txListModel.find(sqFind).select({'_id':0}).sort({height: -1}).then(result => {
					serviceTxListModel.insertMany(result,{ordered:false},function (err) {
						if(err){
							console.error('insert nft failed!',err);
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

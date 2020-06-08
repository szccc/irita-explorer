const config = require('../config/index');
const request = require('request');
const validatorListModel = require('../schema/validator')
const schedule = require('node-schedule');
const mongoUrl = require('../config/index')
let lcdValidatorListUrl = `${config.lcdAddress}/validatorsets/latest`;
schedule.scheduleJob(mongoUrl.syncServiceTime,() => {
	request(lcdValidatorListUrl,(error,response,body) => {
		console.log('验证人同步更新中')
		if(error) {
			throw error
		}else {
			if(response){
				let data = JSON.parse(body)
				let dataList =data.result.validators.map((item)=>{
					return {
						address:item.address,
						pub_key: item.pub_key,
						proposer_priority: item.proposer_priority,
						voting_power: item.voting_power,
						create_time:String(new Date().getTime()),
						update_time:String(new Date().getTime()),
					}
				});
				validatorListModel.insertMany(dataList,{ordered: false},function(err){
					if(err){
						console.error('insert validator failed!',err.errmsg);
					} else{
						console.log('insert validator successfully!');
					}
				})
			}
		}
	})
})

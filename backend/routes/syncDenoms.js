const config = require('../config/index');
const request = require('request');
const denomModel = require('../schema/denom');
const nftModel = require('../schema/nft');
const schedule = require('node-schedule');
const mongoUrl = require('../config/index')
let lcdValidatorListUrl = `${config.lcdAddress}/nft/nfts/denoms`;
schedule.scheduleJob(mongoUrl.syncServiceTime,() => {
    console.log('start sync denoms');
    request(lcdValidatorListUrl,(error,response,body) => {
        if(error) {
            throw error
        }else {
            if(response){
                let data = JSON.parse(body)
                let dataList = data.result.map((d)=>{
                    insertNft(d.name);
                    return {
                        name:d.name,
                        json_schema:d.schema,
                        creator:d.creator,
                    }
                });
                denomModel.insertMany(dataList,function(err){
                    if(err){
                        console.error('insert denom failed!',err.errmsg);
                    } else{
                        console.log('insert denoms successfully!');
                    }

                });
            }
        }
    })
});



function insertNft(name){
    const lcdValidatorListUrl = `${config.lcdAddress}/nft/nfts/collections/${name}`;
    request(lcdValidatorListUrl,(error,response,body) => {
        if(error) {
            throw error
        }else {
            if(response){
                let data = JSON.parse(body)
                if(data.result && data.result.nfts){
                    let dataList = data.result.nfts.map((d)=>{
                        return {
                            name:name,
                            nft_id: d.value.id,
                            onwer: d.value.owner,
                            token_uri: d.value.tokenURI,
                            token_data: d.value.token_data,
                            primary_key:`${name}${d.value.id}`
                        }
                    });
                    console.log(dataList)

                    nftModel.insertMany(dataList,function(err){
                        if(err){
                            console.error('insert nft failed!',err.errmsg);
                        } else{
                            console.log('insert nft successfully!');
                        }

                    });
                }

            }
        }
    })
}

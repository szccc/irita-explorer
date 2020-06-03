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
                data.result.forEach((d)=>{
                    insertNft(d.name);
                    let data = {
                        name:d.name,
                        json_schema:d.schema,
                        creator:d.creator,
                        create_time:String(new Date().getTime()),
                        update_time:String(new Date().getTime()),
                    }
                    denomModel.create(data,function(err){
                        if(err){
                            console.error('insert denom failed!',err.errmsg);
                        } else{
                            console.log('insert denoms successfully!');
                        }

                    });
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
                console.log('--',data.result)
                if(data.result && data.result.nfts){
                    data.result.nfts.forEach((d)=>{
                        let data = {
                            name:name,
                            nft_id: d.value.id,
                            owner: d.value.owner,
                            token_uri: d.value.tokenURI,
                            token_data: d.value.token_data,
                            create_time:String(new Date().getTime()),
                            update_time:String(new Date().getTime()),
                        };
                        nftModel.create(data,function(err){
                            if(err){
                                console.error('insert nft failed!',err.errmsg);
                            } else{
                                console.log('insert nft successfully!');
                            }

                        });
                    });


                }

            }
        }
    })
}

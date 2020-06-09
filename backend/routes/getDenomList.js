const express = require('express');
const router = express.Router();
const denomModel = require('../schema/denom');
const nftModel = require('../schema/nft')

router.get('/', (req, res, next) =>{
    let sqFind = {};
    if(req.query.denom ){
        sqFind['$and'] = [{
            name : req.query.denom
        }]
    }
    let nftCount = new Promise((resolve, reject) => {
        nftModel.count(sqFind).then( count => {
            resolve(count)
        }).catch(err => {
            reject(err)
        })
    })
    nftCount.then(count => {
        nftModel.find(sqFind).select({'_id':0,'__v':0}).skip((Number(req.query.page) - 1) * Number(req.query.size)).limit(Number(req.query.size))
        .then(result =>{
            let responseData = [],responseNft = [];
            if(req.query.tokenId !== ''){
                result.forEach(item => {
                    if(item.nft_id === req.query.tokenId) {
                        responseNft.push(item)
                        item.nft = responseNft
                        responseData.push(item)
                    }
                })
            }else if(req.query.owner !== ''){
                result.forEach(item => {
                    if(item.owner === req.query.owner) {
                        responseNft.push(item)
                        item.nft = responseNft
                        responseData.push(item)
                    }
                })
            }else {
                responseData = result
            }
            res.send({
                count: count,
                data: responseData
            })
        }).catch(err =>{
            console.error('query denoms error:', err)
            res.send(err)
        });
    }).catch(err =>{
        res.send(err)
    })
    
})
module.exports = router;

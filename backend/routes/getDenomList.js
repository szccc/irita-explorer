const express = require('express');
const router = express.Router();
const denomModel = require('../schema/denom');


router.get('/', (req, res, next) =>{
    let sqFind = {};
    if(req.query.denom ){
        sqFind['$and'] = [{
            name : req.query.denom
        }]
    }
    console.log(sqFind)
    let nftCount = new Promise((resolve, reject) => {
        denomModel.aggregate(
            [{$lookup : {from : "sync_nft", localField : "name", foreignField : "name", as : "nft"}},
                {$match:sqFind}
        ]).then(result => [
            resolve(result.length)
        ]).catch(err => {
            reject(err)
        })
    })
    nftCount.then(count => {
        denomModel
        .aggregate(
            [
                {
                    $lookup : {
                        from : "sync_nft",
                        localField : "name",
                        foreignField : "name",
                        as : "nft"
                    }
                },{
                $match:sqFind
            }
            ])
        .skip((Number(req.query.page) - 1) * Number(req.query.size))
        .limit(Number(req.query.size))
        .then(result =>{
            let responseData = [],responseNft = [];
            if(req.query.tokenId !== ''){
                result.forEach(item => {
                    if(item.nft && item.nft.length > 0){
                        item.nft.forEach(value => {
                            if(value.nft_id === req.query.tokenId) {
                                responseNft.push(value)
                                item.nft = responseNft
                                responseData.push(item)
                            }
                        })
                    }
                })
            }else if(req.query.owner !== ''){
                result.forEach(item => {
                    if(item.nft && item.nft.length > 0){
                        item.nft.forEach(value => {
                            if(value.owner === req.query.owner) {
                                responseNft.push(value)
                                item.nft = responseNft
                                responseData.push(item)
                            }
                        })
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

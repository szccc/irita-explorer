const express = require('express');
const router = express.Router();
const denomModel = require('../schema/denom');


router.get('/', (req, res, next) =>{
    let sqFind = {};

    if(req.query.denom){
        sqFind['$and'] = [{
            denom : req.query.denom
        }]
    }
    console.log(sqFind)
    console.log(req.query)
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
        .skip((Number(req.query.pageNum) - 1) * Number(req.query.pageSize))
        .limit(Number(req.query.pageSize))
        .then(result =>{
            res.send(result)
        }).catch(err =>{
        console.error('query denoms error:', err)
        res.send(err)
    });
})
module.exports = router;

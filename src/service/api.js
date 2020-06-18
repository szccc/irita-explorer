import { HttpHelper } from '../helper/httpHelper';
import moment from 'moment';

function get(url){
	return new Promise(async (res,rej)=>{
		let data = await HttpHelper.get(url);
		if(data && data.code == 0){
			res(data.data || data);
		}else{
			console.error(`error form ${url}:`,JSON.stringify(data));
			rej(data);
		}
	}).catch((err)=>{
		console.error(`error form ${url}:`,err.message);
		rej(err);
	});
}

function getFromLcd(url){
	return new Promise(async (res,rej)=>{
		let data = await HttpHelper.getFromLcd(url);
		if(data){
			res(data);
		}else{
			console.error(`error form ${url}:`,JSON.stringify(data));
			rej(data);
		}
	}).catch((err)=>{
		console.error(`error form ${url}:`,err.message);
		rej(err);
	});
}



export function getStatistics(){
	let url = `statistics`;
	return get(url);
}

export function getBlockList(pageNum, pageSize, useCount=false){
	let url = `blocks?pageNum=${pageNum || ''}&pageSize=${pageSize | ''}&useCount=${useCount}`;
	return get(url);
}

export function getDenoms(){
	let url = `denoms`;
	return get(url);
}

export function getNfts(denom, nftId, owner, pageNum, pageSize, useCount=false){
	let url = `nfts?pageNum=${pageNum||''}&pageSize=${pageSize||''}&useCount=${useCount}&denom=${denom||''}&nftId=${nftId||''}&owner=${owner||''}`;
	return get(url);
}

export function getNftDetail(denom, nftId){
	let url = `nfts/details?denom=${denom}&nftId=${nftId}`;
	return get(url);
}

export function getBlockWithHeight(height){
	let url = `blocks/${height}`;
	return get(url);
}

export function getLatestBlock(){
	let url = `blocks/latest`;
	return get(url);
}

export function getValidatorList(isJailed, pageNum, pageSize, useCount=false){
	let url = `validators?jailed=${isJailed}&pageNum=${pageNum||''}&pageSize=${pageSize||''}&useCount=${useCount}`;
	return get(url);
}

export function getAllTxTypes(){
    let url = `txs/types`;
    return get(url);
}

export function getTxList(params){
    const {txType, status, beginTime, endTime, pageNum, pageSize} = params;
    let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
    if(txType){
        url += `&type=${txType}`;
    }
    if(status){
        url += `&status=${status}`;
    }
    if(beginTime){
        url += `&beginTime=${moment(beginTime).startOf('d').unix()}`;
    }
    if(endTime){
        url += `&endTime=${moment(endTime).endOf('d').unix()}`;
    }
    console.log('query tx url', url);
    return get(url);
}

export function getTokenTxList(nftId, denom, pageNum, pageSize,){
    let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&nftId=${nftId}&denom=${denom}`;
    return get(url);
}

export function getServiceDetail(serviceName){
    let url = `txs/services/detail/${serviceName}`;
    return get(url);
}

export function getServiceBindingTxList(serviceName){
    let url = `service/bindings/${serviceName}`;
    return getFromLcd(url);
}

export function getServiceTxList(currentPageNum,pageSize,serviceName){
    let url = `txs/services?pageNum=${currentPageNum}&pageSize=${pageSize}&serviceName=${serviceName}&useCount=true`;
    return get(url);
}

export function getBlockTxList(height){
    let url = `txs/blocks?pageNum=1&pageSize=100&height=${height}`;
    return get(url);
}

export function getTxDetail(hash){
    let url = `txs/${hash}`;
    return get(url);
}

export function getAddressTxList(address, pageNum, pageSize){
    let url = `txs/addresses?pageNum=${pageNum}&pageSize=${pageSize}&address=${address}&useCount=true`;
    return get(url);
}

export function getDefineServiceTxList(pageNum, pageSize){
    let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&type=define_service`;
    return get(url);
}

















import { HttpHelper } from '../helper/httpHelper';

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
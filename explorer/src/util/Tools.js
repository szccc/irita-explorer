export default class Tools{
	/**
	 *  格式化成标准的utc时间
	 */
	static formatUtc(originTime){
		return `${originTime.substr(0,4)}/${originTime.substr(5,2)}/${originTime.substr(8,2)} ${originTime.substr(11,8)}+UTC`;
	}
	
	/**
	 * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
	 */
	static formatAge(currentServerTime,time,suffix,prefix){
		let dateBegin = new Date(time);
		let dateDiff = currentServerTime - dateBegin.getTime();
		let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
		let hourLevel = dateDiff % (24 * 3600 * 1000);
		let hours = Math.floor(hourLevel / (3600 * 1000));
		let minuteLevel = hourLevel % (3600 * 1000);
		let minutes = Math.floor(minuteLevel / (60 * 1000));
		let secondLevel = minuteLevel % (60 * 1000) ;
		let seconds = Math.round(secondLevel / 1000);
		
		let str = `${dayDiff?`${dayDiff}d`:''} ${hours ? `${hours}h` : ''} ${dayDiff && hours ? '' : (minutes ? `${minutes}m`:'')} ${dayDiff || hours || minutes? '' : (seconds ? `${seconds}s`:'')}`;
		if(prefix && suffix){
			return`${prefix} ${str} ${suffix}`
		}else if(suffix){
			return`${str} ${suffix}`
		}else {
			return`${str}`
		}
	}
	/**
	 * 格式化hash
	 * */
	static formatTxHash(txHash){
		return `${txHash.substring(0,3)}...${txHash.substring(txHash.length - 3)}`
	}
	/**
	 * 格式化地址
	 */
	static formatValidatorAddress(address){
		if (address && address.length > 11) {
			return `${address.substring(0,3)}...${address.substring(address.length - 8)}`
		}else if(address && address.length < 11){
			return address
		}
		return '';
	}
	
	/**
	 * 格式化空格
	 */
	static removeAllSpace(str) {
		return str.replace(/\s+/g, "");
	}
	/**
	 * 首字母大写
	 * */
	static firstWordUpperCase (str){
		return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char){
			return char.toUpperCase();
		});
	}
}

import moment from 'moment';
export default class Tools{
	/**
	 *  格式化成标准的utc时间
	 */
	static formatUtc(originTime){
		return Tools.formatDateYearAndMinutesAndSeconds(originTime)
		// return `${originTime.substr(0,4)}/${originTime.substr(5,2)}/${originTime.substr(8,2)} ${originTime.substr(11,8)}+UTC`;
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
	/**
	 * 格式化时间 -> 年月日时分秒
	 * */
	static formatDateYearAndMinutesAndSeconds(timestamp) {
		let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		let D = date.getDate() < 10 ? '0' + (date.getDate()) + " " : (date.getDate()) + ' ';
		let h = date.getHours() < 10 ? '0' + (date.getHours()) : + (date.getHours()) ;
		let m = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : + (date.getMinutes());
		let s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : + (date.getSeconds()) ;
		return Y + M + D + h + ':'+ m + ':'+s;
	}

	static getDisplayDate(timestamp){
	    return moment(timestamp*1000).zone(-8).format("YYYY-MM-DD HH:mm:ss");
    }
}

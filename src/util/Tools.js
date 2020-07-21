import moment from 'moment';
import URLSearchParams from 'url-search-params';
export default class Tools{
	/**
	 * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
	 */
	static formatAge(currentServerTime,time,suffix,prefix){
		let dateBegin = new Date(time);
		let dateDiff = currentServerTime - dateBegin.getTime()/1000;
		if (dateDiff < 0) { return '' };
		//console.log('----',dateBegin.getTime())
		let dayDiff = Math.floor(dateDiff / (24 * 3600));
		let hourLevel = dateDiff % (24 * 3600);
		let hours = Math.floor(hourLevel / 3600);
		let minuteLevel = dateDiff % 3600;
		let minutes = Math.floor(minuteLevel / 60);
		let seconds = dateDiff % 60 ;

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

	static getDisplayDate(timestamp, format = "YYYY-MM-DD HH:mm:ss"){
	    return moment(timestamp*1000).utcOffset(+480).format(format);
    }
    static getFormatDate(date, format = "YYYY-MM-DD HH:mm:ss"){
	    return moment(date).utcOffset(+480).format(format);
    }



    static getTimestamp(){
        return Math.floor(new Date().getTime() / 1000);
    }

    static urlParser(url = document.location.toString()){
        if(url.includes('?')){
            const searchStr = url.split('?')[1];
            let searchInstance = new URLSearchParams(searchStr);
            let params = {};
            for(let entries of searchInstance.entries()){
                params[entries[0]] = entries[1]
            }
            return params;
        }else if(url.includes('&')){
            let searchInstance = new URLSearchParams(url);
            let params = {};
            for(let entries of searchInstance.entries()){
                params[entries[0]] = entries[1]
            }
            return params;
        }else {
            return {}
        }
    }
}

import moment from 'moment'
import BigNumber from 'bignumber.js'
import URLSearchParams from 'url-search-params'
import bech32 from 'bech32'
import moveDecimal from 'move-decimal-point'
import Constant from '../constant/index.js'
import { getConfig } from '@/helper/IritaHelper'

export default class Tools {
  /**
   * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
   */
  static formatAge(currentServerTime, time, suffix, prefix) {
    let dateBegin = new Date(time)
    let dateDiff = currentServerTime - dateBegin.getTime() / 1000
    if (dateDiff < 0) {
      return ''
    }
    let dayDiff = Math.floor(dateDiff / (24 * 3600))
    let hourLevel = dateDiff % (24 * 3600)
    let hours = Math.floor(hourLevel / 3600)
    let minuteLevel = dateDiff % 3600
    let minutes = Math.floor(minuteLevel / 60)
    let seconds = dateDiff % 60

    let str = `${dayDiff ? `${dayDiff}d` : ''} ${hours ? `${hours}h` : ''} ${dayDiff && hours ? '' : minutes ? `${minutes}m` : ''} ${dayDiff || hours || minutes ? '' : seconds ? `${seconds}s` : ''}`
    if (prefix && suffix) {
      return `${prefix} ${str} ${suffix}`
    } else if (suffix) {
      return `${str} ${suffix}`
    } else {
      return `${str}`
    }
  }

  /**
	 * 格式化hash
	 * */
	static formatTxHash(txHash = ''){
		if (txHash.length <= 6) {
			return txHash;
		}
		return `${txHash.substring(0,3)}...${txHash.substring(txHash.length - 3)}`
  }
  
  /**
   * 格式化地址
   */
  static formatValidatorAddress(address) {
    return Tools.format38(address)
  }

  /**
   * 前三后八格式
   */
  static format38(str) {
    if (str && str.length > 11) {
      return `${str.substring(0, 3)}...${str.substring(str.length - 8)}`
    } else if (str && str.length < 11) {
      return str
    }
    return ''
  }

  /**
   * 格式化空格
   */
  static removeAllSpace(str) {
    return str.replace(/\s+/g, '')
  }

  /**
   * 首字母大写
   * */
  static firstWordUpperCase(str) {
    return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char) {
      return char.toUpperCase()
    })
  }
  /**
   * 转换时间格式
   * */
  static getDisplayDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(timestamp * 1000)
      .utcOffset(+480)
      .format(format)
  }

  static getFormatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date)
      .utcOffset(+480)
      .format(format)
  }

  static getTimestamp() {
    return Math.floor(new Date().getTime() / 1000)
  }

  static urlParser(url = document.location.toString()) {
    if (url.includes('?')) {
      const searchStr = url.split('?')[1]
      let searchInstance = new URLSearchParams(searchStr)
      let params = {}
      for (let entries of searchInstance.entries()) {
        params[entries[0]] = entries[1]
      }
      return params
    } else if (url.includes('&')) {
      let searchInstance = new URLSearchParams(url)
      let params = {}
      for (let entries of searchInstance.entries()) {
        params[entries[0]] = entries[1]
      }
      return params
    } else {
      return {}
    }
  }

  static isBech32(str) {
    let allReg = new RegExp(/^[0-9a-zA-Z]*$/i)
    if (!allReg.test(str)) {
      return false
    }

    try {
      bech32.decode(str)
      return true
    } catch (e) {
      return false
    }
  }

  static isValid(value) {
    return !value || !value.length || value == '--' ? false : true
  }
  /**
   * 根据字节截取字符串
   */
  static formatString(string, cutOutlength, addSuffix) {
    let stringLength = string.replace(/[^\x00-\xff]/g, '**').length
    if (stringLength > cutOutlength) {
      if (!addSuffix) {
        addSuffix = '......'
      }
      var bytesLength = 0
      var unitStringUnicodeMaxlength = 255
      for (var index = 0; index < cutOutlength; index++) {
        if (string.charCodeAt(index) > unitStringUnicodeMaxlength) {
          bytesLength = bytesLength + 2
        } else {
          bytesLength = bytesLength + 1
        }
        if (bytesLength >= cutOutlength) {
          string = string.slice(0, index + 1) + addSuffix
          break
        }
      }
      return string
    } else {
      return string + ''
    }
  }
  static formatPriceToFixed(value, fixedValue) {
    return new BigNumber(value).toFormat(fixedValue)
  }
  // 转化uptime的方法
  static FormatUptime(number) {
    return `${(number * 100).toFixed(4)}%`
  }
  static subStrings(value, afterPointLength) {
    //截取指定小数位长度字符串
    if (value) {
      let arr = value.split('.')
      arr[1] = arr[1] || ''
      if (arr[1].toString().length > afterPointLength) {
        value = `${arr[0]}.${arr[1].substring(0, afterPointLength)}`
      } else {
        let diffNum = afterPointLength - arr[1].toString().length
        for (let i = 0; i < diffNum; i++) {
          arr[1] += '0'
        }
        value = `${arr[0]}.${arr[1]}`
      }
      // value = `${arr[0]}.${arr[1].padEnd(afterPointLength, '0').substring(0, afterPointLength)}`;
    }
    return value
  }
  /**
   * 后端返回的数据转换成标准格式
   */
  static format2UTC(originTime) {
    return `${originTime.substr(0, 4)}-${originTime.substr(5, 2)}-${originTime.substr(8, 2)} ${originTime.substr(11, 8)}`
  }
  /**
   * 格式化数字类型是string的数字并让小数点左移18位 (本质是移动小数点的位置)
   *
   */
  static numberMoveDecimal(number) {
    let leftLength = -18
    if (number.toString().indexOf('e') !== -1 || number.toString().indexOf('E') !== -1) {
      if (number.toString().indexOf('e') !== -1) {
        return moveDecimal(new BigNumber(number).toFixed().toString(), leftLength)
      } else {
        return moveDecimal(new BigNumber(number).toFixed().toString() + '.', leftLength)
      }
    } else {
      if (number.toString().indexOf('e') !== -1) {
        return moveDecimal(number.toString(), leftLength)
      } else {
        return moveDecimal(number.toString() + '.', leftLength)
      }
    }
  }
  static formatDenom (denom) {
    let unit = Tools.getUnit()
    if (denom.toLowerCase() === unit.minUnit) {
      return unit.maxUnit
    } else {
      return denom
    }
  }
  /**
   *   科学计数法转成数字
   *
   * */
  static FormatScientificNotationToNumber(number) {
    let formattedNumber
    if (number.toString().indexOf('e') !== -1 || number.toString().indexOf('E') !== -1) {
      formattedNumber = new BigNumber(number).toFixed().toString()
    } else {
      formattedNumber = number
    }
    return formattedNumber
  }

  /**
   * 格式化数字的类型是string的数字并在小数点后面补零
   */
  static formatStringToFixedNumber(str, splitNum) {
    if (str.toString().indexOf('.') !== -1) {
      let splitString = str.split('.')[1]
      if (splitString.length > splitNum) {
        return str.split('.')[0] + '.' + splitString.substr(0, splitNum)
      } else {
        let diffNum = 2 - splitString.length
        for (let i = 0; i < diffNum; i++) {
          splitString += '0'
        }
        return str.split('.')[0] + '.' + splitString
      }
    } else {
      return str + '.00'
    }
  }

  /**
   * format txHash
   * param String
   * return String
   */
  static formatTxHash(txHash) {
    return `${txHash.substring(0, 3)}...${txHash.substring(txHash.length - 3)}`
  }

  /**
   * 获取水龙头Amount
   * param ['11.1111iris']
   * return ['11.1111']
   */
  static formatAccountCoinsAmount(coinsAmount) {
    return (coinsAmount = /[0-9]+[.]?[0-9]*/.exec(coinsAmount))
  }
  static formatAccountCoinsDenom(coinsDenom){
    return coinsDenom = /[A-Za-z\-]{2,15}/.exec(coinsDenom)
  }
  /**
   *   formatAmount
   *   param Object or array
   *   return string
   *   fixedNumber: nonzero
   * */
  static formatAmount2(param, fixedNumber) {
    let amount, amountDenom, amountNumber, amountRadixNumber
    if (param instanceof Array) {
      amount = param[0].amount
      amountDenom = param[0].denom
    } else if (param instanceof Object) {
      amount = param.amount
      amountDenom = param.denom
    }
    if (amount.toString().indexOf('e') !== -1 || amount.toString().indexOf('E') !== -1) {
      if (amount.toString().indexOf('.') !== -1) {
        amountNumber = new BigNumber(amount).toFixed().toString()
      } else {
        amountNumber = new BigNumber(amount).toFixed().toString() + '.'
      }
      amountRadixNumber = Tools.amountRadix(amountDenom)
    } else {
      if (amount.toString().indexOf('.') !== -1) {
        amountNumber = amount.toString()
      } else {
        amountNumber = amount.toString() + '.'
      }
      amountRadixNumber = Tools.amountRadix(amountDenom)
    }
    if (amountDenom) {
      return `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(amountNumber, Number(amountRadixNumber) * -1)).toFormat(), fixedNumber)} ${Constant.RADIXDENOM.IRIS.toLocaleUpperCase()}`
    } else {
      return `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(amountNumber, Number(amountRadixNumber) * -1)).toFormat(), fixedNumber)} SHARES`
    }
  }
  /**
   *   Amount iris Radix
   *   param string
   *   return Radix length
   * */
  static amountRadix(param) {
    let diffValue = 1,
      defaultValue = 18
    if (param) {
      //radix number length need to minus 1;
      switch (param) {
        case Constant.RADIXDENOM.IRISATTO:
          return Constant.RADIXDENOM.IRISATTONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISMILLI:
          return Constant.RADIXDENOM.IRISMILLINUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISMICRO:
          return Constant.RADIXDENOM.IRISMICRONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISNANO:
          return Constant.RADIXDENOM.IRISNANONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISPICO:
          return Constant.RADIXDENOM.IRISPICONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISFEMTO:
          return Constant.RADIXDENOM.IRISFEMTONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRIS:
          return Constant.RADIXDENOM.IRISNUMBER.length - diffValue
          break
        default:
          return defaultValue
      }
    } else {
      return defaultValue
    }
  }
  static firstWordLowerCase(str) {
    return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char) {
      return char.toLocaleLowerCase()
    })
  }
  /**
   * 判断当前是移动端还是pc端
   */
  static currentDeviceIsPersonComputer() {
    const userAgentInfo = navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
      if (userAgentInfo.includes(Agents[i]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }

  static formatUnit (item) {
    let unit = Tools.getUnit()
    if (typeof item === 'number' || typeof item === 'string') {
      let num = new BigNumber(Number(item))
      let Ratio = new BigNumber(Number(unit.conversionRatio))
      return Number(num.dividedBy(Ratio))
    }
    if (typeof item === 'object') {
      if (item.denom === unit.minUnit) {
        let num = new BigNumber(Number(item.amount))
        let Ratio = new BigNumber(Number(unit.conversionRatio))
        return Number(num.dividedBy(Ratio))
      } else {
        return Number(item.amount)
      }
    }
  }
  
  static findNum(str){
      return str.match(/\d+/g);
  }

  static getUnit () {
    let { tokenData } = JSON.parse(sessionStorage.getItem('config'))
    let mainTokenArr = tokenData.filter(item => item.is_main_token)
    let mainToken = mainTokenArr[0]
    let unit = {
      maxUnit: mainToken.symbol,
      minUnit: mainToken.min_unit,
      conversionRatio: 100000
    }
    // console.log(unit,1)
    return unit 
  }

  static formatPerNumber (num) {
    if (typeof num === 'number' && !Object.is(num, NaN)) {
      let afterPoint = String(num).split('.')[1]
      let afterPointLong = (afterPoint && afterPoint.length) || 0
      if (afterPointLong > 2 && num !== 0) {
        return num.toFixed(4)
      } else {
        return num.toFixed(2)
      }
    }
    return num
  }
}

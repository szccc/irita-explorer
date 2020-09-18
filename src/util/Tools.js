import moment from 'moment'
import BigNumber from 'bignumber.js'
import URLSearchParams from 'url-search-params'
import bech32 from 'bech32'
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
    //console.log('----',dateBegin.getTime())
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
  static formatTxHash(txHash = '') {
    return `${txHash.substring(0, 3)}...${txHash.substring(txHash.length - 3)}`
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
   * 后端返回的数据转换成标准格式 (+UTC)
   */
  static format2UTC(originTime) {
    return `${originTime.substr(0, 4)}/${originTime.substr(5, 2)}/${originTime.substr(8, 2)} ${originTime.substr(11, 8)}+UTC`
  }
}

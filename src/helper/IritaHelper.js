import { getConfig as getConfigApi,getIbcTransferByHash } from "@/service/api";
import moveDecimal from 'move-decimal-point'
import Tools from "../util/Tools";
// import { ibcDenomPrefix } from '../constant';

export async function getConfig(){
    let config = window.sessionStorage.getItem('config');
    if (!config) {
        config = await getConfigApi().catch((e)=>{console.error(e)});
        if (config) {
            window.sessionStorage.setItem('config',JSON.stringify(config));
        }else{
            config = {};
        }
    }else{
        config = JSON.parse(config || "{}");
    }
    return config;
}

export async function getMainToken(){
    let config = await getConfig();
    let defaultData = {
        min_unit: "",
        scale: "1",
        symbol: ""
    };
    let mainToken = { ...defaultData };
    if (config.tokenData) {
        mainToken =  config.tokenData.find(item=>item.is_main_token) || defaultData;
    }else{
        console.warn("main token is empty");
    }
    return mainToken;
}

export async function converCoin (_coin) {
    let { tokenData=[] } = await getConfig();
    let coin = {
        denom:'',
        amount:''
    };
    let displayCoin = {};
    if (typeof _coin == 'string') {
        let amount = (/[0-9]+[.]?[0-9]*/.exec(_coin) || [''])[0];
        let denom = _coin.replace(amount,'');
        coin.denom = denom;
        coin.amount = amount;
    }else if(typeof _coin == 'object'){
        coin = {..._coin};
    }else{
        console.warn('invalid amount');
    }

    tokenData.forEach((item)=>{
        if ( item.min_unit == coin.denom ) {
            displayCoin.denom = item.symbol;
            displayCoin.amount = moveDecimal(String(coin.amount || 0),0-item.scale);
        }
    })
    if (!displayCoin.denom) {
        // if (coin && coin.denom && coin.denom.startsWith(ibcDenomPrefix)) {
        //     let hash = coin.denom.replace(ibcDenomPrefix,'')
        //     let res = await getIbcTransferByHash(hash)
        //     if(res && res.denom_trace && res.denom_trace.base_denom) {
        //         coin.denom = (ibcDenomPrefix + res.denom_trace.base_denom).toUpperCase()
        //     }
        // }
        console.warn('Denom did not match');
        return coin;
    }
    return displayCoin;
}

export async function addressRoute (address) {
    let { addressPrefix = {} } = await getConfig();
    if (addressPrefix.iva) {
        let length = addressPrefix.iva.length 
        if(address) {
            if (address.substring(0, length) === addressPrefix.iva) {
                return this.$router.push(`/staking/${address}`)
            } else {
                return this.$router.push(`/address/${address}`)
            }
        }
    }
    return '';
}

export function formatMoniker (moniker,monikerNum) {
    if (!moniker) {
        return "";
    }
    return Tools.formatString(moniker.trim(), monikerNum, "...");
}

import { getConfig as getConfigApi } from "@/service/api";
import moveDecimal from 'move-decimal-point'

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
    let mainToken = {...defaultData};
    if (config.tokenData) {
        mainToken =  config.tokenData.find(item=>item.is_main_token) || defaultData;
    }else{
        console.warn("main token is empty");
    }
    return mainToken;
}

export async function converCoin(_coin){
    let { tokenData=[] } = await getConfig();
    let coin = {};
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
        console.warn('Denom did not match');
        return coin;
    }
    return displayCoin;
}

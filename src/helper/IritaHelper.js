import { getConfig as getConfigApi } from "@/service/api";


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

export async function formatAmount(amount){
    let config = await getConfig();
    let coin = {};
    if (typeof amount == 'string') {
        coin.demo = '';
        coin.amount = '';
    }else if(typeof amount == 'object'){
        coin = {...amount};
    }else{
        console.warn('invalid amount');
    }
}
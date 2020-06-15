import { cfg } from '../config';
import axios from 'axios';


export class HttpHelper {

    static async get(url){
        const prefix = `${cfg.server.address}`;
        const data = await axios.get(`${prefix}/${url}`);
        if(data && data.status === 200){
            return data.data;
        } else {
            console.error('request from server failed:', data);
            return null
        }
    }

    static async getFromLcd(url){
        const data = await axios.get(`${cfg.server.lcd}/${url}`);
        if(data && data.status === 200){
            return data.data;
        } else {
            console.error('request from server failed:', data);
            return null
        }
    }

}
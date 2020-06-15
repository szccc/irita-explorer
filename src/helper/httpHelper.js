import { cfg } from '../config';
import axios from 'axios';


export class HttpHelper {

    static async get(url, address = cfg.server.address){
        const data = await axios.get(`${address}/${url}`);
        if(data && data.status === 200){
            return data.data;
        } else {
            console.error('request from server failed:', data);
            return null
        }
    }

}
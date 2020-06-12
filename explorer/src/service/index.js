import Service from '../axios'
import urlApi from '../api'
const Server = {
	commonInterface(params, callback, errCallBack) {
		let url ;
		if(JSON.stringify(params[Object.keys(params)[0]]) === '{}'){
			url = urlApi[Object.keys(params)[0]]
		}else {
			url = urlApi[Object.keys(params)[0]];
			for(let key in params[Object.keys(params)[0]]){
				let rule =`{${key}}`;
				url = url.replace(new RegExp(rule,"g"),params[Object.keys(params)[0]][key]);
			}
		}
		Service.http(url).then( (res) => {
			if (res.code == 0) {
				callback  ? callback(res.data || null) : null;
			}else{
				errCallBack ? errCallBack(res) : null;
			}
		}).catch(err => {
			errCallBack ? errCallBack({error:err}) : null;
		})
	},
}
export default Server

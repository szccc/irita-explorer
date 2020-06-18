// export const cfg = {
// 	env:'dev',
//     buildNumber:'200',
//     server : {
//         address: 'http://10.1.4.224:3000',
//         lcd: 'http://10.2.10.130:2317',
//     }
// };

let { NODE_ENV, VUE_APP_SERVER_ADDR, VUE_APP_LCD_ADDR } = process.env;

export const cfg = {
	env: NODE_ENV,
    server : {
        address: VUE_APP_SERVER_ADDR,
        lcd: VUE_APP_LCD_ADDR,
    }
};
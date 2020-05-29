const configuration = require("./config");

const config = {
	mongoUrl: configuration.app.mongoUrl,
	lcdAddress:configuration.app.lcdAddress,
	syncServiceTime: configuration.app.syncServiceTime
};
module.exports = config;
// "mongoUrl":"mongodb://irita:iritapassword@192.168.150.32:27017/irita-explorer",
// "mongoUrl":"mongodb://csrb:csrbpassword@192.168.150.33:37017/sync",


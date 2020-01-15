const configuration = require("./config");

const config = {
	mongoUrl: configuration.app.mongoUrl,
	lcdAddress:configuration.app.lcdAddress,
	syncServiceTime: configuration.app.syncServiceTime
};
module.exports = config;

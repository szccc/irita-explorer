/*导航栏功能映射{
	"100":"区块浏览",
	"101":"交易浏览",
	"102":"共识节点",
	"103":"NFT资产",
	"104":"服务浏览",
	"105":"搜索"(始终排在末尾)}*/

let config = {
	lang:'CN', 								//国际化 CN / EN
	"title":"ggggg",								//浏览器标签标题
	"logo":{
		"title":"CSChain-Bond",				//logo标题
		"subTitle":"债券应用链浏览器",			//logo副标题
	},
	"nav":{
		"color":"red",						//nav文字颜色
		"activeTextColor":"",			//nav文字高亮颜色
		"bgColor":""					//nav背景颜色 上半部分
	},
	"footer":{
		"color":"rgba(255,255,255,0.5)",	//nav背景颜色
		"bgColor_top":"#363A3D",			//nav背景颜色 上半部分
		"bgColor_bottom":"#000000",			//nav背景颜色 下半部分
		"copyright":"copyright © 2020 边界智能",
	},
	"navFuncList":["100","101","102","103","104","105"],	//导航栏功能列表
	"homeCard":{				//首页卡片配置
		"lestBlock":true,
		"txCount":true,
		"avgBlockTime":true,
		"validatorCount":true,
		"serviceCount":true,
		"assetCount":true,
	},
	"funcConfig":{				//模块支持 
		"block":true,
		"tx":true,
		"validator":true,
		"asset":true,
		"service":true
	},
	"text":{
		"color":{				//预设字体颜色
			"first": "#171D44",  					//一级文字色
			"second": "#787C99",					//二级文字色
			"third": "#C0C4CC",						//三级文字色
			"fourth": "rgba(255,255,255,0.5)",		//四级文字色
			"link": "#3264fd",						//链接文字色
		}
	},
	button:{
		"color":{				//预设按钮字体颜色
			"common":"",
		},
		"bgColor":{				//预设按钮背景颜色
			"common":"",
		}
	}
}
module.exports = config;
// export default config;
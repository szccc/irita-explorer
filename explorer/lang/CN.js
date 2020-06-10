export const ExplorerCN = {
	Navigation:{
		block: '区块',
		transactions: '交易',
		validators: '验证人',
		nftAsset: '资产',
		service: '服务',
		searchPlaceHolder: '搜索地址/交易摘要/区块高度'
	},
	home:{
		blockHeight: '最新区块高度',
		transactions: '交易总量',
		avgBlockTime: '平均出块时间',
		last100Blocs: '最近100个区块',
		validators: '验证人总数',
		services: '服务总量',
		assets: '资产总量',
		blocks: '最近区块',
		viewAll: '查看全部',
		listTransactions: '最近交易',
	},
	block:{
		currentHeight: '当前区块',
		block: '区块',
		transactions: '交易',
		timestamp: '时间',
		age: '距离当前时间'
	},
	blockDetail:{
		blockHash: '区块哈希:',
		transaction: '交易总量:',
		timestamp: '时间:',
		
	},
	transactions:{
		txs: '交易',
		search: '搜索',
		txHash: '交易摘要',
		block: '区块高度',
		txType: '交易类型',
		from: '发送方',
		to: '接收方',
		signer: '签名方',
		status: '交易状态',
		timestamp: '时间',
		requestId: '请求标识'
	},
	validators:{
		name: '名称',
		operator: '维护者',
		votingPower: '权重',
		pubKey: '公钥'
	},
	nftAsset:{
		assets: '资产',
		search: '搜索',
		denom: '报表类别',
		owner: '拥有者',
		id: '报表标识',
		data: '链上数据',
		uri: '链接',
		placeHolder: '搜索报表标识'
	},
	service: {
		services: '服务',
		serviceName: '服务名称',
		txHash: '交易摘要',
		publisher: '提供者',
		from: '创建者',
		description: '描述',
		status: '服务状态'
	},
	transactionInformation:{
		transactionInformation: '交易详情',
		txHash: '交易摘要：',
		blockHeight: '区块高度：',
		status: '交易状态：',
		timestamp: '时间：',
		signer: '签名者：',
		memo: '备注：',
		transactionMessage: '交易消息',
		txType: '交易类型：',
		issueDenom:{
			denom: '报表类别：',
			schema: '数据结构：',
			sender: '创建者：',
		},
		send:{
			amount: '数量：',
			from: '发送方：',
			to: '接收方：',
		},
		callService: {
			consumer: '服务消费方：',
			input: '输入内容：',
			provider: '服务提供方：',
			repeated: '是否重复调用：',
			repeatedFrequency: '重复调用频率：',
			repeatedTotal: '重复调用总量：',
			serviceFeeCap: '服务费用：',
			superMode: '超级模式：',
			timeOut: '超时时间：',
			serviceName: '服务名称：'
		},
		respondService:{
			output: '输出内容：',
			provider: '服务提供者：',
			requestId: '请求标识：',
			result: '响应结果：'
		},
		burnNft:{
			sender: '发送方：',
			denom: '报表类别：',
			id: '报表标识：'
		},
		transferNft: {
			denom: '报表类别：',
			id: '报表标识：',
			recipient: '接收方：',
			sender: '发送方：',
			data: '链上数据：',
			uri: '链接：'
		},
		editNft:{
			denom: '报表类别：',
			id: '报表标识：',
			sender: '发送方：',
			data: '链上数据：',
			uri: '链接：'
		},
		defineService: {
			serviceName: '服务名称：',
			description: '描述：',
			tags: '标签：',
			author: '服务创建者：',
			authorDescription: '创建者简介：'
		},
		bindService: {
			deposit: '押金：',
			owner: '拥有者：',
			pricing: '服务价格：',
			provider: '服务提供者：',
			qos: '服务评价：',
			serviceName: '服务名称：'
		},
		mintNft: {
			denom: '报表类别：',
			id: '报表标识：',
			recipient: '接收方：',
			sender: '发送方：',
			data: '链上数据：',
			uri: '链接：'
		}
	},
	addressDetail: {
		assets: '资产列表',
		owner: '拥有者',
		denom: '报表类别',
		name: '名称',
		id: '报表标识',
		data: '链上数据',
		uri: '链接',
	},
	nftDetail: {
		nftInformation: '资产详情',
		owner: '拥有者：',
		denom: '报表类别：',
		id: '报表标识：',
		schema: '数据结构：',
		data: '链上数据：',
		creator: '创建者：',
		uri: '链接：',
		nftTxs: '资产交易'
	},
	serviceDetail: {
		serviceDefinition: '服务详情',
		author: '创建者：',
		authorDescription: '创建者简介：',
		description: '服务简介：',
		name: '名称：',
		schema: '数据结构：',
		tags: '标签：',
		serviceBindings: {
			serviceBindings: '服务绑定',
			serviceName: '服务名称',
			available: '有效性',
			deposit: '押金',
			owner: '拥有者',
			pricing: '价格',
			provider: '提供者',
			qos: '评价'
		},
		serviceTransactions: '服务交易'
	},
	searchResult:{
		title: '搜索结果',
		backHome: '返回首页',
		resultTitle: '搜索结果为空。',
		searchTip: '尝试搜索交易、区块高度。'
	}
}

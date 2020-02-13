const urlAPI ={
	homeNavigation:'/api/home/navigation',
	homeLatestBlock:'/api/blocks/recent',
	homeLatestTransaction:'/api/txs/recent',
	blockList:'/api/blocks?page={pageNum}&size={pageSize}',
	txList:'/api/txs?page={pageNumber}&size={pageSize}&txType={txType}&status={status}&beginTime={beginTime}&endTime={endTime}',
	allTxType:'/api/allTxType',
	nftList:'/api/nft/denoms',
	denomInformation:'/api/nft/denom?denom={denom}&page={pageNum}&size={pageSize}&owner={owner}&tokenId={tokenId}',
	ownerDetail:'/api/nft/owner?owner={ownerAddress}',
	getTokenUri: '/api/nft/collection?denom={denom}&tokenId={tokenId}',
	getTxByAddress: '/api/address/txs?page={pageNum}&size={pageSize}&owner={ownerAddress}',
	getTxByToken: '/api/token/txs?page={pageNum}&size={pageSize}&tokenId={tokenId}',
	serviceInformation:'/api/service?serviceName={serviceName}&chainId={chainId}',
	serviceBindingList:'/api/service/binding?serviceName={serviceName}&chainId={chainId}',
	serviceTransaction: '/api/service/transaction?serviceName={serviceName}&chainId={chainId}',
	getTransactionInformation:"/api/tx?txhash={hash}",
	getServiceList:'/api/services?page={pageNumber}&size={pageSize}',
	blockInformation:'/api/blockInformation?height={height}',
	blockInformationTx:'/api/blockTxList?height={height}',
	validatorList:'/api/validatorList?status={status}&page={pageNum}&size={pageSize}'
};
export default urlAPI

const urlAPI ={
	//1
	statistics:'/api/statistics',
	homeLatestTransaction:'/api/txs/recent',
	//1
	blockList:'/api/blocks?pageNum={pageNum}&pageSize={pageSize}&useCount={useCount}',
	txList:'/api/txs?page={pageNumber}&size={pageSize}&txType={txType}&status={status}&beginTime={beginTime}&endTime={endTime}',
	allTxType:'/api/allTxType',
	//1
	denoms:"/api/denoms",
	//1
	nftList:'/api/nfts?pageNum={pageNum}&pageSize={pageSize}&useCount={useCount}&denom={denom}&nftId={nftId}&owner={owner}',
	//1
	nftDetails:'/api/nfts/details?denom={denom}&nftId={nftId}',
	denomInformation:'/api/nft/denom?denom={denom}&page={pageNum}&size={pageSize}&owner={owner}&tokenId={tokenId}',
	// ownerDetail:'/api/nft/owner?owner={ownerAddress}',
	getTokenUri: '/api/nft/collection?denom={denom}&tokenId={tokenId}',
	getTxByAddress: '/api/address/txs?page={pageNum}&size={pageSize}&owner={ownerAddress}',
	getTxByToken: '/api/token/txs?page={pageNum}&size={pageSize}&tokenId={tokenId}&denom={denom}',
	serviceInformation:'/api/service?serviceName={serviceName}',
	serviceBindingList:'/api/service/binding?serviceName={serviceName}',
	serviceTransaction: '/api/service/transaction?serviceName={serviceName}&page={pageNum}&size={pageSize}',
	getTransactionInformation:"/api/tx?txhash={hash}",
	getServiceList:'/api/services?page={pageNumber}&size={pageSize}',
	//1
	blockInformation:'/api/blocks/{height}',
	//1
	latestBlock:'/api/blocks/latest',
	blockInformationTx:'/api/blockTxList?height={height}',
	validatorList:'/api/validatorList?status={status}&page={pageNum}&size={pageSize}'
};
export default urlAPI

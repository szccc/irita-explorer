<template>
	<div class="nft_token_container">
		<div class="nft_token_content_wrap">
			<div class="nft_token_title">{{$t('ExplorerCN.nftDetail.nftInformation')}}</div>
			<div class="nft_token_information_content">
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.owner')}}</span>
					<span>
						<router-link :to="`/address/${owner}`">{{owner}}</router-link>
					</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.denom')}}</span>
					<span>{{name}}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.id')}}</span>
					<span>{{tokenID}}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.schema')}}</span>
					<span>{{schema}}</span>
				</div>
				<!--<div class="nft_token_information_item">
					<span>Primary Key</span>
					<span>{{primaryKey}}</span>
				</div>-->
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.data')}}</span>
					<span>{{tokenData}}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.creator')}}</span>
					<span>{{creator}}</span>
				</div>
				
				
				
				<div class="nft_token_information_item">
					<span>{{$t('ExplorerCN.nftDetail.uri')}}</span>
					<span v-if="tokenUri && tokenUri !== '--'">
						<a :href="tokenUri" target="_blank">{{tokenUri}}</a>
					</span>
					<span v-else>--</span>
				</div>
			</div>
			<div class="nft_token_list_content">
				<div class="nft_token_list_title"> {{$t('ExplorerCN.nftDetail.nftTxs')}}</div>
				<el-table :data="txListByToken">
					<el-table-column :label="$t('ExplorerCN.transactions.txHash')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.txHash"
										class="item"
										placement="top"
										effect="dark">
								<router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.from')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.from"
										class="item"
										placement="top"
										effect="dark">
								<router-link v-if="scope.row.from !== '--'" :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
							</el-tooltip>
							<span v-if="scope.row.from === '--'">{{formatAddress(scope.row.from)}}</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.to')" >
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.to"
										class="item"
										placement="top"
										effect="dark">
								<router-link v-if="scope.row.to !== '--'" :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}</router-link>
							</el-tooltip>
							<span v-if="scope.row.to === '--'">{{formatAddress(scope.row.to)}}</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.signer')" >
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.signer"
										class="item"
										placement="top"
										effect="dark">
								<router-link :to="`/address/${scope.row.signer}`">{{formatAddress(scope.row.signer)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.status')" prop="status"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.timestamp')" prop="time" width="200px">
						<template slot-scope="scope">
							<span>{{scope.row.time}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	import Server from "../service"
	import Tools from "../util/Tools"
	export default {
		name: "NftToken",
		data() {
			return {
				owner:'',
				Denom: '',
				TokenID: '',
				Uri:'',
				pageNum:1,
				pageSize: 10,
				txListByToken:[],
				creator:'',
				schema: '',
				name:'',
				tokenID:'',
				primaryKey:'',
				tokenData:'',
				tokenUri:''
			}
		},
		mounted () {
			this.getTokenInformation();
		},
		methods:{
			getTokenInformation(){
				Server.commonInterface({nftDetails:{
						denom: this.$route.query.denom,
						nftId: this.$route.query.tokenId,
					}},(data) => {
					try {
						if(data){
							this.creator = (data.denomDetail || {}).creator;
							this.schema = (data.denomDetail || {}).json_schema;
							this.name = data.denom;
							this.tokenID = data.id;
							// this.primaryKey = data.primary_key;
							this.owner = data.owner;
							this.tokenData = data.tokenData;
							this.tokenUri = data.tokenUri;
								
							this.getTokenTx()
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			getTokenTx(){
				Server.commonInterface({getTxByToken:{
						tokenId: this.tokenID,
						denom: this.$route.query.denom,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}},(res) => {
					try {
						if(res){
							this.txListByToken = res.map( item => {
								return {
									txHash: item.tx_hash,
									blockHeight: item.height,
									txType: item.type,
									from: item.from ? item.from : '--',
									to: item.to ? item.to : '--',
									signer: item.signer,
									status:item.status === 1 ? 'Success' :'Fail',
									time: Tools.formatUtc(item.time)
								}
							})
						}
						
					}catch (e) {
						console.error(e)
					}
				})
			},
			formatTxHash(TxHash){
				if(TxHash){
					return Tools.formatTxHash(TxHash)
				}
			},
			formatAddress(address){
				return Tools.formatValidatorAddress(address)
			},
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.nft_token_container{
		.nft_token_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.nft_token_title{
				font-size: 0.18rem;
				color: #22252A;
				font-weight: bold;
				padding: 0.3rem 0 0.1rem 0;
				text-align: left;
				text-indent: 0.2rem;
			}
			.nft_token_information_content{
				box-sizing: border-box;
				border: 0.01rem solid #E7E9EB;
				border-radius: 0.04rem;
				background: #fff;
				padding: 0.2rem;
				.nft_token_information_item{
					text-align: left;
					margin-bottom: 0.16rem;
					display: flex;
					span:nth-of-type(1){
						width: 1.27rem;
						font-size: 0.14rem;
						color: #787C99;
						line-height: 0.16rem;
					}
					span:nth-of-type(2){
						font-size: 0.14rem;
						color: #171D44;
						flex: 1;
					}
				}
				.nft_token_information_item:last-child{
					margin-bottom: 0;
				}
			}
			.nft_token_list_content{
				.nft_token_list_title{
					font-size: 0.18rem;
					color: #22252A;
					line-height: 0.21rem;
					font-weight: bold;
					text-align: left;
					text-indent: 0.2rem;
					margin: 0.3rem 0 0.1rem 0;
				}
			}
			
		}
	}
</style>

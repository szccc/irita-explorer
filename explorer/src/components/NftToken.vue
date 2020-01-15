<template>
	<div class="nft_token_container">
		<div class="nft_token_content_wrap">
			<div class="nft_token_title">NFT Token Information</div>
			<div class="nft_token_information_content">
				<div class="nft_token_information_item">
					<span>Owner:</span>
					<span>
						<router-link :to="`/address/${Owner}`">{{Owner}}</router-link>
					</span>
				</div>
				<div class="nft_token_information_item">
					<span>Denom:</span>
					<span>{{Denom}}</span>
				</div>
				<div class="nft_token_information_item">
					<span>Token ID</span>
					<span>{{TokenID}}</span>
				</div>
				<div class="nft_token_information_item">
					<span>URI</span>
					<span>
						<a :href="Uri" target="_blank">{{Uri}}</a></span>
				</div>
			</div>
			<div class="nft_token_list_content">
				<div class="nft_token_list_title">NFT Token Txs</div>
				<el-table :data="txListByToken">
					<el-table-column label="TxHash">
						<template slot-scope="scope">
							<!--	<el-tooltip effect="dark" :content="scope.row.txHash" placement="top">
								</el-tooltip>-->
							<!--<span>{{formatTxHash(scope.row.txHash)}}</span>-->
							<router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
						</template>
					</el-table-column>
					<el-table-column label="Block">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
						</template>
					</el-table-column>
					<el-table-column label="TxType" prop="txType"></el-table-column>
					<el-table-column label="From">
						<template slot-scope="scope">
							<router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
						</template>
					</el-table-column>
					<el-table-column label="To">
						<template slot-scope="scope">
							<router-link  v-if="scope.row.to !== '--'" :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}</router-link>
							<span v-if="scope.row.to === '--'">--</span>
						</template>
					</el-table-column>
					<el-table-column label="Signer">
						<template slot-scope="scope">
							<router-link :to="`/address/${scope.row.signer}`">{{formatAddress(scope.row.signer)}}</router-link>
						</template>
					</el-table-column>
					<el-table-column label="Status" prop="status"></el-table-column>
					<el-table-column label="Timestamp" prop="time"></el-table-column>
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
				Owner:'',
				Denom: '',
				TokenID: '',
				Uri:'',
				pageNum:1,
				pageSize: 10,
				txListByToken:[]
			}
		},
		mounted () {
			this.getTokenInformation();
		},
		methods:{
			getTokenInformation(){
				Server.commonInterface({getTokenUri:{
						denom: this.$route.query.denom,
						tokenId: this.$route.query.tokenId,
					}},(res) => {
					try {
						if(res){
							this.Owner = res.owner;
							this.Denom = this.$route.query.denom;
							this.TokenID = res.id;
							this.Uri = res.token_uri;
							this.getTokenTx()
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			getTokenTx(){
				Server.commonInterface({getTxByToken:{
						tokenId: this.TokenID,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}},(res) => {
					try {
						if(res){
							this.txListByToken = res.data.map( item => {
								return {
									txHash: item.hash,
									blockHeight: item.height,
									txType: item.txType,
									from: item.from ? item.from : '--',
									to: item.to ? item.to : '--',
									signer: item.signer,
									status:item.status,
									time: Tools.formatUtc(item.timestamp)
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

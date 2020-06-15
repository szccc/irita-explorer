<template>
	<div class="address_container_content">
		<div class="address_content_wrap">
			<div class="address_text_title">{{address}}</div>
			<div class="address_asset_content">
				<div class="address_asset_title">{{$t('ExplorerCN.addressDetail.assets')}}</div>
				<el-table :data="assetArray">
					<el-table-column :label="$t('ExplorerCN.addressDetail.owner')" width="150px">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.owner"
							            class="item"
							            placement="top"
							            effect="dark">
								<router-link :to="`/address/${scope.row.owner}`">{{formatAddress(scope.row.owner)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.addressDetail.denom')" width="150px">
						<template slot-scope="scope">
							<router-link :to="`/nft/token?denom=${scope.row.denom}&&tokenId=${scope.row.id}`">{{scope.row.denom}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.addressDetail.name')" width="150px" prop="name"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.addressDetail.id')" width="150px">
						<template slot-scope="scope">
							<router-link :to="`/nft/token?denom=${scope.row.denom}&&tokenId=${scope.row.id}`">{{scope.row.id}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.addressDetail.data')" width="350px" prop="tokenData"></el-table-column>
<!--					<el-table-column label="Primary Key" width="300px" prop="primaryKey"></el-table-column>-->
					<el-table-column :label="$t('ExplorerCN.addressDetail.uri')" prop="tokenUri">
						<template slot-scope="scope">
							<a v-if="scope.row.tokenUri" :download="scope.row.tokenUri" :href="scope.row.tokenUri" target="_blank">{{scope.row.tokenUri}}</a>
							<span v-else>--</span>
						</template>
					</el-table-column>
					<!--<el-table-column label="ID" prop="id">
						<template slot-scope="scope">
							<router-link :to="`/nft/token?denom=${scope.row.denom}&tokenId=${scope.row.id}`">{{scope.row.id}}</router-link>
						</template>
					</el-table-column>
					<el-table-column label="Token">
						<template slot-scope="scope">
							<router-link :to="`/nft/token?denom=${scope.row.denom}&tokenId=${scope.row.id}`">{{scope.row.denom}}</router-link>
						</template>
					</el-table-column>
					<el-table-column label="URI" prop="tokenUri" width="650px">
						<template slot-scope="scope">
							<a v-if="scope.row.tokenUri && scope.row.tokenUri !== '&#45;&#45;'" :href="scope.row.tokenUri" target="_blank">{{scope.row.tokenUri}}</a>
							<span v-else>&#45;&#45;</span>
						</template>
					</el-table-column>-->
				</el-table>
			</div>
			<div class="address_transaction_content">
				<el-table :data="txList">
					<el-table-column :label="$t('ExplorerCN.transactions.txHash')">
						<template slot-scope="scope">
							<el-tooltip effect="dark"
							            :content="scope.row.txHash"
							            placement="top">
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
							<el-tooltip class="item" effect="dark" :content="scope.row.from" placement="top">
								<router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.to')">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.to" placement="top">
								<router-link  v-if="scope.row.to !== '--'" :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}</router-link>
							</el-tooltip>
							<span v-if="scope.row.to === '--'">--</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.signer')">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.signer" placement="top">
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
			<div class="pagination_content" v-show="flShowPagination">
				<m-pagination :page-size="pageSize"
				              :total="totalTxNumber"
				              :page="pageNum"
				              :page-change="pageChange">
				</m-pagination>
			</div>
		</div>
	</div>

</template>

<script>
	import Server  from "../service"
	import Tools from "../util/Tools"
	import MPagination from "./MPagination";
	export default {
		name: "OwnerDetail",
		components: {MPagination},
		data() {
			return{
				assetArray:[],
				denomArray:[],
				address:'',
				pageNum: 1,
				pageSize: 10,
				txList:[],
				totalTxNumber:0,
				flShowPagination:false
			}
		},
		watch:{
			$route(){
				this.getOwnerDetail();
				this.getTxByAddress();
				this.address = this.$route.params.param
			}
		},
		mounted () {
			this.getOwnerDetail();
			this.getTxByAddress();
			this.address = this.$route.params.param
		},
		methods:{
			getOwnerDetail(){
				Server.commonInterface({nftList:{
						owner: this.$route.params.param,
						pageSize:1000,
						pageNum:1,
						useCount:false,
						denom:'',
						nftId:'',
					}},(data) => {
					try {
						if(data && data.data ){
							this.assetArray = data.data.map(item => {
								return{
									denom: item.denom,
									id: item.id,
									name: item.denom,
									owner: item.owner,
									// primaryKey: item.primary_key,
									tokenData: item.tokenData,
									tokenUri: item.tokenUri,
								}
							})
							/*res.map(item => {
								if(item){
									this.denomArray = item.ids.map(id => {
										return {
											id: id,
											denom: item.denom,
										}
									})
								}
								this.assetArray = [];
								this.denomArray.forEach(item => {
									this.getDenomUri(item.denom,item.id,(res) => {
										item.tokenUri = res;
										this.assetArray.unshift(item)
										
									});
								})
							});*/
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			getDenomUri(denom,id,callback){
				Server.commonInterface({getTokenUri:{denom: denom, tokenId: id}},(res) => {
					try {
						if(res){
							if(res.token_uri){
								callback(res.token_uri)
							}else {
								callback('--')
							}
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			getTxByAddress(){
				Server.commonInterface({getTxByAddress:{
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						ownerAddress: this.$route.params.param
					}},(res) => {
					try {
						if(res){
							this.totalTxNumber = res.count;
							if(res.count > this.pageSize){
								this.flShowPagination  = true
							}else {
								this.flShowPagination  = false
							}
							this.txList = res.data.map(item => {
								return{
									txHash: item.hash,
									blockHeight: item.height,
									txType: item.txType,
									from: item.from ? item.from : '--',
									to: item.to ? item.to : '--',
									signer: item.signer,
									status:Tools.firstWordUpperCase(item.status),
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
			pageChange(pageNum) {
				this.pageNum = pageNum;
				this.getTxByAddress()
			}
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.address_container_content{
		.address_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.address_text_title{
				text-align: left;
				font-size: 0.22rem;
				color: #171D44;
				line-height: 0.26rem;
				font-weight: bold;
				padding: 0.3rem 0;
				text-indent: 0.2rem;
			}
			.address_asset_content{
				.address_asset_title{
					font-size: 0.18rem;
					color: #22252A;
					text-indent: 0.2rem;
					margin-bottom: 0.1rem;
					text-align: left;
				}
			}
			.address_transaction_content{
				margin-top: 0.2rem;
			}
			.pagination_content{
				margin: 0.1rem 0 0.2rem 0;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
</style>

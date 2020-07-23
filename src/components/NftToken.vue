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
					<el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.txHash')">
						<template slot-scope="scope">
							<div class="tx_transaction_content_hash">
                  <img class="status_icon"
                               :src="require(`../assets/${scope.row.status?'success.png':'failed.png'}`)"/>
                  <el-tooltip effect="dark"
                              :content="scope.row.txHash"
                              placement="top">
                      <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                  </el-tooltip>
              </div>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
						</template>
					</el-table-column>
					<el-table-column min-width="130px" :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.from')">
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
					<el-table-column min-width="130px" :label="$t('ExplorerCN.transactions.to')" >
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
					<el-table-column min-width="130px" :label="$t('ExplorerCN.transactions.signer')" >
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.signer"
										class="item"
										placement="top"
										effect="dark">
								<router-link :to="`/address/${scope.row.signer}`">{{formatAddress(scope.row.signer)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.timestamp')" prop="time" width="200px">
						<template slot-scope="scope">
							<span>{{scope.row.time}}</span>
						</template>
					</el-table-column>
				</el-table>
                <div class="pagination_content">
                    <m-pagination :page-size="pageSize" :total="count" :page="pageNum" :page-change="pageChange"></m-pagination>
                </div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getNftDetail } from "../service/api"
	import Tools from "../util/Tools"
	import {getTokenTxList} from '../service/api'
    import MPagination from "./MPagination";
	export default {
		name: "NftToken",
		data() {
			return {
				owner:'',
				Denom: '',
				TokenID: '',
				Uri:'',
				pageNum:1,
                count:0,
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
        components: {MPagination},
		mounted () {
			this.getTokenInformation();
		},
		methods:{
			async getTokenInformation(){
				try {
					let nftDetail = await getNftDetail(this.$route.query.denom, this.$route.query.tokenId);

					if(nftDetail){
						this.creator = (nftDetail.denomDetail || {}).creator;
						this.schema = (nftDetail.denomDetail || {}).json_schema;
						this.name = nftDetail.denom;
						this.tokenID = nftDetail.id;
						// this.primaryKey = nftDetail.primary_key;
						this.owner = nftDetail.owner;
						this.tokenData = nftDetail.tokenData;
						this.tokenUri = nftDetail.tokenUri;
							
						this.getTokenTx()
					}
				}catch (e) {
					console.error(e)
				}
			},
            pageChange(pageNum){
			    this.pageNum = pageNum;
			    this.getTokenTx();
            },
			async getTokenTx(){
                const res = await getTokenTxList(this.tokenID,this.$route.query.denom,this.pageNum ,this.pageSize );
                try {
                    // console.log(res)
                    this.txListByToken = res.data.map((tx)=>{
                        return {
                            txHash : tx.tx_hash,
                            blockHeight : tx.height,
                            txType : tx.type,
                            from : tx.from ? tx.from : '--',
                            to : tx.to ? tx.to : '--',
                            signer : tx.signer,
                            status : tx.status,
                            time :Tools.getDisplayDate(tx.time)
                        }
                    });
                    this.count = res.count;
                    // console.log(this.txListByToken)
                }catch (e) {
                		console.error(e);
                    this.$message.error(this.$t('ExplorerCN.message.txListFailed'));
                }
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
		padding:0 0.15rem;
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
						min-width: 1.27rem;
						font-size: 0.14rem;
						color: #787C99;
						line-height: 0.16rem;
					}
					span:nth-of-type(2){
						font-size: 0.14rem;
						color: #171D44;
						flex: 1;
						word-break:break-all;
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
        .pagination_content{
            display: flex;
            justify-content: flex-end;
            margin: 0.3rem 0 0.1rem 0;
        }
        .tx_transaction_content_hash{
            display: flex;
            align-items: center;
        }
			}
			.status_icon{
	        width:0.13rem;
	        height:0.13rem;
	        margin-right:0.05rem;
	    }
		}
	}

	@media screen and (max-width: 768px) {
        .nft_token_container{
			.nft_token_content_wrap{
				
				.nft_token_title{
					
				}
				.nft_token_information_content{
					
					.nft_token_information_item{
						
						span:nth-of-type(1){
							min-width: 1rem;
						}
						span:nth-of-type(2){
							
						}
					}
					.nft_token_information_item:last-child{
						
					}
				}
				.nft_token_list_content{
					.nft_token_list_title{
						
					}
	                .pagination_content{
	                    
	                }
				}
				
			}
		}
    }
</style>

<template>
	<div class="service_information_container">
		<div class="service_information_content_wrap">
			<div class="service_information_definition_content">
				<h3 class="service_information_definition_title">{{$t('ExplorerCN.serviceDetail.serviceDefinition')}} ({{$route.query.serviceName}})</h3>
				<div class="service_information_content">
					<!--<p class="service_information_text_content">
						<span>Chain ID:</span>
						<span>{{chainId}}</span>
					</p>-->
					<p class="service_information_text_content">
						<span>{{$t('ExplorerCN.serviceDetail.author')}}</span>
						<span>{{author}}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{$t('ExplorerCN.serviceDetail.authorDescription')}}</span>
						<span>{{authorDescription}}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{$t('ExplorerCN.serviceDetail.description')}}</span>
						<span>{{description}}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{$t('ExplorerCN.serviceDetail.name')}} </span>
						<span>{{name}}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{$t('ExplorerCN.serviceDetail.schema')}}</span>
						<span>{{schemas}}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{$t('ExplorerCN.serviceDetail.tags')}}</span>
						<span>{{tags}}</span>
					</p>
					
					
					
					<!--<p class="service_information_text_content">
						<span>Publisher:</span>
						<span><router-link :to="`/address/${publisher}`">{{publisher}}</router-link></span>
					</p>
					<p class="service_information_text_content">
						<span>Description:</span>
						<span>{{description}}</span>
					</p>
					<p class="service_information_text_content">
						<span>IDL Content:</span>
						<span >{{idlContent}}</span>
					</p>-->
				</div>
			</div>
			<div class="service_information_bindings_content">
				<h3 class="service_information_binding_title">{{$t('ExplorerCN.serviceDetail.serviceBindings.serviceBindings')}}</h3>
				<div class="service_information_bindings_table_content">
					<el-table :data="bindingArray">
						<!--<el-table-column label="TxHash" prop="txHash"></el-table-column>-->
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.serviceName')" prop="serviceName"></el-table-column>
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.available')" prop="available"></el-table-column>
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.deposit')" prop="deposit"></el-table-column>
<!--						<el-table-column label="Disabled Time" prop="disabledTime"></el-table-column>-->
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.owner')">
							<template slot-scope="scope">
								<router-link :to="`/address/${scope.row.owner}`">{{formatAddress(scope.row.owner)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.pricing')" prop="pricing"></el-table-column>
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.provider')">
							<template slot-scope="scope">
								<router-link :to="`/address/${scope.row.provider}`">{{formatAddress(scope.row.provider)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.qos')" prop="qos"></el-table-column>
						<!--<el-table-column label="Status" prop="status"></el-table-column>-->
					</el-table>
				</div>
			</div>
			<div class="service_information_transaction_content">
				<h3 class="service_information_transaction_title">{{$t('ExplorerCN.serviceDetail.serviceTransactions')}}</h3>
				<div class="service_information_transaction_table_content">
					<el-table :data="transactionArray">
						<el-table-column :label="$t('ExplorerCN.transactions.txHash')">
							<template slot-scope="scope">
								<router-link :to="`tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.block')" >
							<template slot-scope="scope">
								<router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.requestId')">
							<template slot-scope="scope">
								<el-tooltip :content="scope.row.requestId"  v-if="scope.row.requestId">
									<span>{{formatAddress(scope.row.requestId)}}</span>
								</el-tooltip>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>
						
						<el-table-column :label="$t('ExplorerCN.transactions.from')">
							<template slot-scope="scope">
								<router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.to')">
							<template slot-scope="scope">
								<el-tooltip v-if="scope.row.content && scope.row.content.length > 0 ">
									<div slot="content">
										<div style="display: flex;flex-direction: column">
											<span v-for="item in scope.row.content">{{item}}</span>
										</div>
									</div>
									<span>{{scope.row.to}}</span>
								</el-tooltip>
								<router-link v-if="scope.row.to !== '' && scope.row.content && scope.row.content.length == 0" :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}</router-link>
								<span v-if="scope.row.to === ''">--</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.status')" prop="status"></el-table-column>
						
						<el-table-column :label="$t('ExplorerCN.transactions.timestamp')" prop="timestamp"></el-table-column>
					</el-table>
				</div>
			</div>
			<div class="pagination_content">
				<keep-alive>
					<m-pagination :page-size="pageSize"
								  :total="txCount"
								  :page="currentPageNum"
								  :page-change="pageChange">
					</m-pagination>
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
	import Service from "../service"
	import Tools from "../util/Tools"
	import MPagination from "./MPagination";
    import { HttpHelper } from '../helper/httpHelper';
    import moment from 'moment';
    import {cfg} from '../config';
	export default {
		name: "ServiceInformation",
		components: {MPagination},
		data() {
			return {
				from:'',
				chainId: '',
				publisher:'',
				description:'',
				idlContent:'',
				bindingArray:[],
				transactionArray:[],
				pageSize:10,
				currentPageNum:1,
				txCount:0,
				author:'',
				authorDescription:'',
				name:'',
				schemas:'',
				tags:''
				
			}
		},
		mounted () {
			this.getServiceInformation();
			this.getServiceBindingList();
			this.getServiceTransaction()
			// this.getServiceTransaction()
		},
		methods:{
			pageChange(pageNum){
				this.currentPageNum = pageNum;
				this.getServiceTransaction();
			},
			async getServiceInformation(){
                let url = `txs/services/detail/${this.$route.query.serviceName}`;
                const res = await HttpHelper.get(url);
                console.log(res)
                if(res && res.code === 0){
                    if(res.data.msgs && res.data.msgs.length > 0 && res.data.msgs[0].msg){
                        const {author, author_description, description, name, schemas, tags} = res.data.msgs[0].msg;
                        this.author = author;
                        this.authorDescription = author_description ? author_description : '--';
                        this.description = description;
                        this.name = name;
                        this.schemas = schemas;
                        this.tags = tags;
                    }

                    this.getServiceTransaction();
                } else if(res.code){

                } else {

                }
			},
			async getServiceBindingList(){
                let url = `txs/services/detail/${this.$route.query.serviceName}`;
                const res = await HttpHelper.get(url, cfg.server.lcd);
                if(res && res.code === 0){
                    console.log(res)
                   /* this.bindingArray = res.data.map((item) =>{
                        return {
                            available : `${item.available}`,
                            deposit : `${item.deposit[0].amount} ${item.deposit[0].denom}`,
                            disabledTime : Tools.formatUtc(item.disabled_time),
                            owner : item.owner,
                            pricing : `${item.pricing}`,
                            provider : item.provider,
                            qos : item.qos,
                            serviceName : item.service_name,
                        }
                    })*/

                } else if(res.code){

                } else {

                }
			},
			async getServiceTransaction(){
                let url = `txs/services?pageNum=${this.currentPageNum}&pageSize=${this.pageSize}&serviceName=${this.$route.query.serviceName}`;
                const res = await HttpHelper.get(url);
                if(res && res.code === 0){
                    this.transactionArray = res.data.data.map((item) => {
                        let toAddressArray = [];
                        if(item.to.includes(',')){
                            toAddressArray = item.to.split(",")
                        }
                        return {
                            txType: item.type,
                            from: item.from ? item.from : '--',
                            signer: item.signer,
                            status:item.status === 1 ? 'Success' : 'Failed',
                            txHash: item.tx_hash,
                            requestId:item.msgs[0].msg.request_id,
                            to: toAddressArray.length > 0 ? `${toAddressArray.length} Address` : item.to,
                            content:toAddressArray,
                            height: item.height,
                            timestamp: moment(item.time).zone(+0).format("YYYY-MM-DD HH:mm:ss"),
                        }
                    })

                } else if(res.code){

                } else {

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
	.service_information_container{
		.service_information_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.service_information_definition_content{
				.service_information_definition_title{
					margin: 0.3rem 0 0.1rem 0;
					font-size: 0.18rem;
					line-height: 0.21rem;
					font-weight: bold;
					color: #22252a;
					text-align: left;
					text-indent: 0.2rem;
				}
				.service_information_content{
					box-sizing: border-box;
					padding: 0.2rem;
					background: #fff;
					.service_information_text_content{
						display: flex;
						justify-content: flex-start;
						margin-bottom: 0.16rem;
						span:nth-of-type(1){
							font-size: 0.14rem;
							line-height: 0.16rem;
							color: #787C99;
							width: 1.5rem;
							text-align: left;
						}
						span:last-child{
							font-size: 0.14rem;
							line-height: 0.16rem;
							color: #171D44;
							flex: 1;
							text-align: left;
						}
					}
					.service_information_text_content:last-child{
						margin-bottom: 0;
					}
				}
			}
			.service_information_bindings_content{
				.service_information_binding_title{
					font-size: 0.18rem;
					color: #22252A;
					line-height: 0.21rem;
					text-align: left;
					text-indent: 0.2rem;
					margin: 0.3rem 0 0.1rem 0;
				}
				.service_information_bindings_table_content{
					background: #fff;
				}
			}
			.service_information_transaction_content{
				.service_information_transaction_title{
					font-size: 0.18rem;
					color: #22252A;
					line-height: 0.21rem;
					text-align: left;
					text-indent: 0.2rem;
					margin: 0.3rem 0 0.1rem 0;
				}
				.service_information_transaction_table_content{
					background: #fff;
				}
			}
			.pagination_content{
				display: flex;
				justify-content: flex-end;
				margin: 0.1rem 0 0.2rem 0;
			}
		}
	}
</style>

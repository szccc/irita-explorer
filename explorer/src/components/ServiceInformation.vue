<template>
	<div class="service_information_container">
		<div class="service_information_content_wrap">
			<div class="service_information_definition_content">
				<h3 class="service_information_definition_title">Service Definition ({{$route.query.serviceName}})</h3>
				<div class="service_information_content">
					<p class="service_information_text_content">
						<span>Chain ID:</span>
						<span>{{chainId}}</span>
					</p>
					<p class="service_information_text_content">
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
					</p>
				</div>
			</div>
			<div class="service_information_bindings_content">
				<h3 class="service_information_binding_title">Service Bindings</h3>
				<div class="service_information_bindings_table_content">
					<el-table :data="bindingArray">
						<!--<el-table-column label="TxHash" prop="txHash"></el-table-column>-->
						<el-table-column label="Binding Chain ID" prop="bindingChainId"></el-table-column>
						<el-table-column label="From">
							<template slot-scope="scope">
								<router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column label="Binding Type" prop="bindingType"></el-table-column>
						<el-table-column label="Avg Rsp Time" prop="avgRspTime"></el-table-column>
						<el-table-column label="Usable Time" prop="usableTime"></el-table-column>
						<!--<el-table-column label="Status" prop="status"></el-table-column>-->
					</el-table>
				</div>
			</div>
			<div class="service_information_transaction_content">
				<h3 class="service_information_transaction_title">Service Transactions</h3>
				<div class="service_information_transaction_table_content">
					<el-table :data="transactionArray">
						<el-table-column label="TxHash">
							<template slot-scope="scope">
								<router-link :to="`tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column label="Request ID">
							<template slot-scope="scope">
								<span>{{scope.row.requestId || '--'}}</span>
							</template>
						</el-table-column>
						<el-table-column label="Tx Type" prop="txType"></el-table-column>
						<el-table-column label="From">
							<template slot-scope="scope">
								<router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column label="To">
							<template slot-scope="scope">
								<router-link v-if="scope.row.to !== '--'" :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}</router-link>
								<span v-if="scope.row.to === '--'">--</span>
							</template>
						</el-table-column>
						<el-table-column label="Height" >
							<template slot-scope="scope">
								<router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
							</template>
						</el-table-column>
						<el-table-column label="Timestamp" prop="timestamp"></el-table-column>
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
			}
		},
		mounted () {
			this.getServiceInformation();
			this.getServiceBindingList();
		},
		methods:{
			pageChange(pageNum){
				this.currentPageNum = pageNum;
				this.getServiceTransaction();
			},
			getServiceInformation(){
				Service.commonInterface({serviceInformation:{
						serviceName:this.$route.query.serviceName,
						chainId:this.$route.query.chainId
					}},(res) => {
					try {
						if(res && res.definition){
							this.from = res.definition.author;
							this.chainId = res.definition.chain_id;
							this.publisher = res.definition.author;
							this.description = res.definition.description;
							this.idlContent = res.definition.idl_content;
							this.getServiceTransaction();
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			getServiceBindingList(){
				Service.commonInterface({serviceBindingList:{
						serviceName:this.$route.query.serviceName,
						chainId:this.$route.query.chainId
					}},(res) => {
					try {
						if(res){
							this.bindingArray = res.map((item) => {
								return {
									bindingChainId: item.bind_chain_id,
									from: item.provider,
									bindingType: item.binding_type,
									avgRspTime: item.level.avg_rsp_time,
									usableTime: item.level.usable_time,
								}
							})
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			getServiceTransaction(){
				Service.commonInterface({serviceTransaction:{
						serviceName:this.$route.query.serviceName,
						chainId:this.$route.query.chainId,
						pageNum: this.currentPageNum,
						pageSize: this.pageSize
					}},(res)=>{
					try {
						if(res){
							this.txCount = res.count;
							this.transactionArray = res.data.map(item => {
								return {
									txHash: item.tx_hash,
									requestId:item.msgs[0].msg.chain_id,
									txType: item.txType,
									from: item.from ? item.from : '--',
									to: item.to ? item.to : '--',
									height: item.height,
									timestamp:Tools.formatUtc(item.time)
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
							color: #787C99;
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

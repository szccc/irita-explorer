<template>
	<div class="service_list_container_content">
		<div class="service_list_content_wrap">
			<div class="service_list_title">{{$t('ExplorerCN.service.services')}}</div>
			<div class="service_list_content">
				<el-table :data="serviceList">
					<el-table-column :label="$t('ExplorerCN.service.serviceName')">
						<template slot-scope="scope">
							<span>
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</span>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.service.txHash')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.txHash"
							            effect="dark" placement="top">
								<router-link :to="`tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
<!--					<el-table-column label="Chain ID" prop="chainId"></el-table-column>-->
					<el-table-column :label="$t('ExplorerCN.service.publisher')" prop="publisher">
						<template slot-scope="scope">
							<el-tooltip placement="top"
							            effect="dark"
							            :content="scope.row.publisher">
								<router-link :to="`/address/${scope.row.publisher}`">{{formatAddress(scope.row.publisher)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.service.from')">
						<template slot-scope="scope">
							<el-tooltip placement="top"
							            effect="dark"
							            :content="scope.row.from">
								<router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.service.description')" prop="description"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.service.status')" prop="status"></el-table-column>
				</el-table>
			</div>
			<div class="pagination_content">
				<m-pagination :page-size="pageSize"
				              :total="txCount"
				              :page="pageNum"
				              :page-change="pageChange">
					
				</m-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import Service from "../service"
	import Tools from "../util/Tools"
	import MPagination from "./MPagination";
    import { HttpHelper } from '../helper/httpHelper';
	export default {
		name: "ServiceList",
		components: {MPagination},
		data() {
			return {
				pageNum: 1,
				pageSize: 20,
				serviceList:[],
				txCount:0,
			}
		},
		mounted () {
			this.getServiceList();
		},
		methods:{
			async getServiceList(){
                let url = `txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&type=define_service`;
                const res = await HttpHelper.get(url);
                if(res && res.code === 0){
                    console.log(res)
                    this.serviceList = res.data.data.map((tx)=>{
                        let msgServiceName,msgPublisher,msgDescription;
                        if(tx.msgs && tx.msgs.length > 0){
                            msgServiceName = tx.msgs[0].msg.name;
                            msgPublisher = tx.msgs[0].msg.author;
                            msgDescription = tx.msgs[0].msg.description
                        }
                        return {
                            txHash: tx.tx_hash,
                            serviceName: msgServiceName,
                            publisher: msgPublisher,
                            from: tx.from,
                            description: msgDescription,
                            status: tx.status === 1 ? '成功' : '失败'
                        }
                    });
                    console.log(this.serviceList)
                    this.txCount = res.data.count;

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
			pageChange(pageNum) {
				this.pageNum = pageNum;
				this.getServiceList();
			}
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.service_list_container_content{
		.service_list_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.service_list_title{
				color: #22252A;
				font-size: 0.18rem;
				line-height: 0.21rem;
				font-weight: bold;
				text-indent: 0.2rem;
				margin: 0.3rem 0 0.1rem 0;
				text-align: left;
			}
		}
		.pagination_content{
			display: flex;
			justify-content: flex-end;
			margin: 0.1rem 0 0.2rem 0;
		}
	}
</style>

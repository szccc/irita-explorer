<template>
	<div class="service_list_container_content">
		<div class="service_list_content_wrap">
			<div class="service_list_title">{{$t('ExplorerCN.service.services')}}</div>
			<div class="service_list_content" v-for="service in serviceList">
                <div class="service_list_top">
                    <span class="service_list_service_name">
                        <router-link :to="`/service?serviceName=${service.serviceName}`">
                            {{ service.serviceName }}
                        </router-link>
                    </span>
                </div>

				<el-table :data="service.bindList">
					<el-table-column min-width="140px" :label="$t('ExplorerCN.service.provider')">
						<template slot-scope="scope">
							<span>
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">
                                    {{Tools.formatValidatorAddress(scope.row.provider)}}
                                </router-link>
							</span>
						</template>
					</el-table-column>
					<el-table-column min-width="100px" :label="$t('ExplorerCN.service.respondTimes')">
						<template slot-scope="scope">
							<span>
								<router-link :to="`tx?txHash=${scope.row.txHash}`">{{scope.row.respondTimes}}</router-link>
							</span>
						</template>
					</el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.service.isAvailable')" prop="isAvailable"></el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.service.price')" prop="price"></el-table-column>
					<el-table-column min-width="180px" :label="$t('ExplorerCN.service.minBlock')" prop="qos"></el-table-column>
					<el-table-column min-width="180px" :label="$t('ExplorerCN.service.time')" prop="bindTime"></el-table-column>
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
	import Tools from "../util/Tools"
	import MPagination from "./MPagination";
    import {getAllServiceTxList, getServiceBindingByServiceName} from "../service/api";

    export default {
		name: "ServiceList",
		components: {MPagination},
		data() {
			return {
				pageNum: 1,
				pageSize: 20,
				serviceList:[],
				txCount:0,
                Tools,
			}
		},
		mounted () {
			this.getServiceList();
		},
		methods:{
			async getServiceList(){
                try {
                    let serviceList = await getAllServiceTxList(this.pageNum,this.pageSize);
                    if(serviceList && serviceList.data){
                        console.log(serviceList)
                        for(let service of serviceList.data){
                            let bindings = await getServiceBindingByServiceName(service.serviceName);

                            if(bindings.result){
                                service.bindList.forEach((s)=>{
                                    s.bindTime = Tools.getDisplayDate(s.bindTime);
                                    bindings.result.forEach((b)=>{
                                        if(s.provider === b.provider){
                                            s.isAvailable = b.available ? 'True' : 'False';
                                            s.price = JSON.parse(b.pricing).price;
                                            s.qos = b.qos;
                                        }
                                    })
                                })
                            }
                        }
                        console.log(serviceList)
                        this.serviceList = serviceList.data;

                        this.txCount = serviceList.count;

                    }
                }catch (e) {
                    console.error(e);
                    this.$message.error('获取服务交易列表失败,请稍后重试');
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
        @media screen and (min-width: 910px){
            .service_list_content_wrap{
                max-width: 12rem;
            }

        }
        @media screen and (max-width: 910px){
            .service_list_content_wrap{
                width:100%;
                padding:0 0.15rem;
                box-sizing: border-box;

            }

        }
		.service_list_content_wrap{
			margin: 0 auto;
			.service_list_title{
				color: #22252A;
				font-size: 0.18rem;
				line-height: 0.21rem;
				font-weight: bold;
				margin: 0.3rem 0 0.1rem 0;
				text-align: left;
			}
            .service_list_content{
                display:flex;
                flex-direction:column;
                margin-bottom:0.48rem;
                padding:0.28rem 0.28rem 0.18rem 0.28rem;
                background: #ffffff;
                border-radius:5px;
                border:1px solid rgba(215,215,215,1);
                .service_list_top{
                    display:flex;
                    justify-content: flex-start;
                    margin-bottom:0.4rem;
                    .service_list_service_name{
                        color:#3264FD;
                        font-size:0.14rem;
                        font-weight:600;
                        cursor:pointer;
                    }
                }
            }
		}
		.pagination_content{
			display: flex;
			justify-content: flex-end;
			margin: 0.1rem 0 0.2rem 0;
		}
	}
</style>

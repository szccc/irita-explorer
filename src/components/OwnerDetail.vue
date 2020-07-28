<template>
	<div class="address_container_content">
		<div class="address_content_wrap">
			<div class="address_content_title">
	          <div class="address_content_title_first">{{`${$t('ExplorerCN.addressDetail.addressDetail')} |`}}</div>
	          <div class="address_content_title_address">{{address}}</div>
	      	</div>
			<div class="address_asset_content">
				<div class="content_title">{{$t('ExplorerCN.addressDetail.assets')}}</div>
				<el-table :data="assetArray" :empty-text="$t('ExplorerCN.element.table.emptyDescription')">
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
					<el-table-column :label="$t('ExplorerCN.addressDetail.uri')" prop="tokenUri">
						<template slot-scope="scope">
							<a v-if="scope.row.tokenUri" :download="scope.row.tokenUri" :href="scope.row.tokenUri" target="_blank">{{scope.row.tokenUri}}</a>
							<span v-else>--</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="consumer_transaction_content">
				<div class="content_title">{{$t('ExplorerCN.addressDetail.consumerTitle')}}</div>
				<el-table :data="consumerTxList"
						  row-key="txHash"
                          :empty-text="$t('ExplorerCN.element.table.emptyDescription')"
						  :span-method="arraySpanMethod"
    					  >
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.serviceType')">
						<template slot-scope="scope">
							<el-tooltip v-if="!scope.row.isChildren" class="item" effect="dark" :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</el-tooltip>
							<span v-if="scope.row.isChildren && scope.row.index==0">{{getRespondCount(scope.row.count)}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="130px" :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>
					<el-table-column min-width="100px" :label="$t('ExplorerCN.addressDetail.requestStatus')">
						<template slot-scope="scope">
							<div v-if="scope.row.state" class="consumer_transaction_content_available">
								<span class="consumer_transaction_content_available_icon" :style="`background:${getBgColorWithState(scope.row.state)}`"></span>
								<span>{{scope.row.state}}</span>
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
						</template>
					</el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.txHash')">
						<template slot-scope="scope">
							<div class="address_transaction_content_hash">
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
					<el-table-column min-width="130px" :label="$t('ExplorerCN.addressDetail.requestId')">
                        <template slot-scope="scope">
                            <span>{{formatAddress(scope.row.requestContextId)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120px" :label="$t('ExplorerCN.transactionInformation.provider')">
                        <template slot-scope="scope">
                            <el-tooltip v-if="scope.row.txType=='respond_service'" 
                            			effect="dark"
								        :content="scope.row.provider"
								        placement="top">
								<router-link   :to="`/address/${scope.row.provider}`">
                                	{{formatAddress(scope.row.provider)}}
                            	</router-link>
							</el-tooltip>
                            <div v-if="scope.row.txType=='call_service'">
                                    <el-tooltip effect="dark"
                                                v-if="(scope.row.provider || []).length === 1"
								            	:content="scope.row.provider[0]"
								            	placement="top">
						            	<router-link :to="`/address/${scope.row.provider[0]}`">
                                        	{{formatAddress(scope.row.provider[0])}}
                                    	</router-link>
									</el-tooltip>
                                <div class="service_tx_muti_to_container"
                                     v-else>
                                    <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                                        {{ scope.row.provider.length }} providers
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200px" :label="$t('ExplorerCN.addressDetail.timestamp')">
						<template slot-scope="scope">
							<span>{{`${scope.row.time}`}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination_content" v-show="consumerTxCount > consumerTxPageSize">
					<m-pagination :page-size="consumerTxPageSize"
					              :total="consumerTxCount"
					              :page="consumerTxPageNum"
					              :page-change="consumerTxPageChange">
					</m-pagination>
				</div>
			</div>
			<div class="provider_transaction_content">
				<div class="content_title">{{$t('ExplorerCN.addressDetail.providerTitle')}}</div>
				<el-table :data="providerTxList" :empty-text="$t('ExplorerCN.element.table.emptyDescription')">
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.serviceType')">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column min-width="100px" :label="$t('ExplorerCN.addressDetail.respondTimes')">
						<template slot-scope="scope">
							<router-link :to="`/service/respond/${scope.row.serviceName}/${address}`">{{`${scope.row.respond_times} ${$t('ExplorerCN.unit.time')}`}}</router-link>
						</template>
					</el-table-column>
					<el-table-column min-width="100px" :label="$t('ExplorerCN.addressDetail.available')">
						<template slot-scope="scope">
							<div class="provider_transaction_content_available">
								<span class="provider_transaction_content_available_icon" :style="`background:${scope.row.isAvailable?'#B1E96E':'#C4C4C4'}`"></span>
								<span class="provider_transaction_content_available_status">{{scope.row.isAvailable?"True":'False'}}</span>
							</div>
						</template>
					</el-table-column>
					<!-- <el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.pricing')">
						<template slot-scope="scope">
							<span>{{scope.row.pricing}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.deposit')">
						<template slot-scope="scope">
							<span>{{scope.row.deposit}}</span>
						</template>
					</el-table-column> -->
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.qos')">
						<template slot-scope="scope">
							<span>{{`${scope.row.qos} ${$t('ExplorerCN.unit.blocks')}`}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="200px" :label="$t('ExplorerCN.addressDetail.bindTime')">
						<template slot-scope="scope">
							<span>{{`${scope.row.time}`}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="200px" :label="$t('ExplorerCN.addressDetail.disabledTime')">
						<template slot-scope="scope">
							<span>{{scope.row.isAvailable ? '--' : scope.row.unbindTime}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="content_title" style="margin-top:0.4rem">{{$t('ExplorerCN.addressDetail.respondRecord')}}</div>
				<el-table :data="respondRecordList" :empty-text="$t('ExplorerCN.element.table.emptyDescription')">
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.serviceType')">
						<template slot-scope="scope">
							<el-tooltip v-if="scope.row.serviceName" class="item" effect="dark" :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</el-tooltip>
							<span v-if="!scope.row.serviceName">--</span>
						</template>
					</el-table-column>
					<el-table-column min-width="130px" :label="$t('ExplorerCN.transactions.txType')" prop="type"></el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.respondHash')">
						<template slot-scope="scope">
							<div class="respond_transaction_content_hash">
								<img class="status_icon"
                                             :src="require(`../assets/${scope.row.respondStatus?'success.png':'failed.png'}`)"/>
								<el-tooltip effect="dark"
								            :content="scope.row.respondHash"
								            placement="top">
									<router-link :to="`/tx?txHash=${scope.row.respondHash}`">{{formatTxHash(scope.row.respondHash)}}</router-link>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column min-width="130px" :label="$t('ExplorerCN.addressDetail.requestId')">
                        <template slot-scope="scope">
                            <span>{{formatAddress(scope.row.requestContextId)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('ExplorerCN.transactions.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.height}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :label="$t('ExplorerCN.transactions.timestamp')" prop="time" width="200px">
						<template slot-scope="scope">
							<span>{{Tools.getDisplayDate(scope.row.time)}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.consumer')">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.consumer" placement="top">
								<router-link  v-if="scope.row.consumer && scope.row.consumer.length" :to="`/address/${scope.row.consumer}`">{{formatAddress(scope.row.consumer)}}</router-link>
							</el-tooltip>
							<span v-if="!scope.row.consumer">--</span>
						</template>
					</el-table-column>
					<el-table-column min-width="120px" :label="$t('ExplorerCN.addressDetail.requestHash')">
						<template slot-scope="scope">
							<div class="address_transaction_content_hash">
								<img v-if="scope.row.requestHash && scope.row.requestHash !='--'" class="status_icon"
                                            src="../assets/success.png"/>
								<el-tooltip v-if="scope.row.requestHash && scope.row.requestHash != '--'" effect="dark"
								            :content="scope.row.requestHash"
								            placement="top">
									<router-link :to="`/tx?txHash=${scope.row.requestHash}`">{{formatTxHash(scope.row.requestHash)}}</router-link>
								</el-tooltip>
								<span v-else>{{'--'}}</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination_content" v-show="respondRecordCount > respondRecordPageSize">
					<m-pagination :page-size="respondRecordPageSize"
					              :total="respondRecordCount"
					              :page="respondRecordPageNum"
					              :page-change="respondRecordPageChange">
					</m-pagination>
				</div>
			</div>
			<div class="address_transaction_content">
				<div class="content_title">{{$t('ExplorerCN.addressDetail.txRecord')}}</div>
				<div class="address_transaction_condition_container">
                    <span class="address_transaction_condition_count">
                        {{ totalTxNumber }} Txs
                    </span>
                    <el-select v-model="type_temp">
                        <el-option v-for="(item, index) in txTypeOption"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="status_temp">
                        <el-option v-for="(item, index) in statusOpt"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <div class="address_transaction_condition_action">
                    	<div class="search_btn" @click="handleSearchClick">
	                        {{$t('ExplorerCN.transactions.search')}}
	                    </div>
	                    <div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
                    </div>
                </div>
				<TxListComponent :txData="txList"></TxListComponent>
				<div class="pagination_content" v-show="totalTxNumber > pageSize">
					<m-pagination :page-size="pageSize"
					              :total="totalTxNumber"
					              :page="pageNum"
					              :page-change="pageChange">
					</m-pagination>
				</div>
			</div>
			
		</div>
	</div>

</template>

<script>
	import { getNfts } from "../service/api";
	import Tools from "../util/Tools";
	import MPagination from "./MPagination";
	import {TxHelper} from "../helper/TxHelper";
	import TxListComponent from "./common/TxListComponent";
  import {
  	getAddressTxList,
    getCallServiceWithAddress,
		getRespondServiceWithAddress,
		getRespondServiceRecord,
		getServiceBindingByServiceName,
		getServiceContextsByServiceName,
		getAllServiceTxTypes} from "../service/api";

    export default {
		name: "OwnerDetail",
		components: { MPagination, TxListComponent },
		data() {
			return{
				Tools,
				assetArray:[],
				denomArray:[],
				address:'',
				pageNum: 1,
				pageSize: 10,
				txList:[],
				totalTxNumber:0,
				providerTxList:[],
				consumerTxPageNum:1,
				consumerTxPageSize: 5,
				consumerTxCount:0,
				consumerTxList:[],
				respondRecordList:[],
				respondRecordPageNum:1,
				respondRecordPageSize: 5,
				respondRecordCount:0,
				type:'',
                status:'',
                type_temp:'',
                status_temp:'',
                statusOpt : [
                    {
                        value : '',
                        label : this.$t('ExplorerCN.common.allTxStatus')
                    },
                    {
                        value : 1,
                        label : this.$t('ExplorerCN.common.success')
                    },
                    {
                        value : 2,
                        label : this.$t('ExplorerCN.common.failed')
                    }
                ],
                txTypeOption : [
                    {
                        value : '',
                        label : this.$t('ExplorerCN.common.allTxType')
                    },
                ],
			}
		},
		watch:{
			$route(){
				this.address = this.$route.params.param;
				this.getOwnerDetail();
				this.getTxByAddress();
				this.getConsumerTxList();
				this.getRspondRecordList();
				this.getProviderTxList();
				
			}
		},
		mounted () {
			document.documentElement.scrollTop = 0;
			this.getOwnerDetail();
			this.getAllTxType();
			this.getTxByAddress();
			this.getConsumerTxList();
			this.getRspondRecordList();
			this.getProviderTxList();
			this.address = this.$route.params.param
		},
		methods:{
			async getOwnerDetail(){
				try {				
					let nftData = await getNfts('', '', this.$route.params.param, 1, 1000, true);
					if(nftData && nftData.data ){
						this.assetArray = nftData.data.map(item => {
							return{
								denom: item.denom,
								id: item.id,
								name: item.denom,
								owner: item.owner,
								tokenData: item.tokenData,
								tokenUri: item.tokenUri,
							}
						})
					}
				}catch (e) {
					console.error(e)
				}
			},
			//地址相关交易记录
			async getTxByAddress(){
			    try {
                    const res = await getAddressTxList(this.$route.params.param, this.type, this.status, this.pageNum, this.pageSize);
                    if(res){
                        console.log('addressTx======:',res);
                        this.totalTxNumber = res.count;
                        this.txList = res.data;
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerCN.message.txListFailed'));
                }
			},
			pageChange(pageNum) {
				this.pageNum = pageNum;
				this.getTxByAddress()
			},
			//服务调用-消费者
			async getConsumerTxList(){
			    try {
                    const res = await getCallServiceWithAddress(this.$route.params.param, this.consumerTxPageNum, this.consumerTxPageSize, true);
                    if(res){
                        console.log('ConsumerTx======:',res);
                        this.consumerTxCount = res.count;
                        this.consumerTxList = [];
                        for (let item of res.data){
                            let result = {
                                serviceName:item.msgs[0].msg.service_name || '--',
								txHash: item.tx_hash,
								blockHeight: item.height,
								txType: item.type,
								provider:item.msgs[0].msg.providers,
								time: Tools.getDisplayDate(item.time),
								state:"Running",
								status:item.status,
								respond:[],
                            };
                            item.events.forEach((item)=>{
	                            (item.attributes || []).forEach((attr)=>{
	                                if (attr.key == 'request_context_id') {
	                                    result.requestContextId = attr.value;
	                                }
	                            });
	                        });
	                        let context = await getServiceContextsByServiceName(result.requestContextId || '');
	                        if (context && context.result && context.result.value) {
	                        	result.state = context.result.value.state;
	                        }
                            this.consumerTxList.push(result);
                            if (item.respond && item.respond.length) {
	                        	item.respond.forEach((r,index)=>{
	                        		let respondResult = {
	                        			index,
	                        			isChildren:true,
	                        			count:item.respond.length,
		                        		serviceName:(r.msgs[0].msg.ex || {}).service_name || '',
										txHash: r.tx_hash,
										blockHeight: r.height,
										txType: r.type,
										provider:r.msgs[0].msg.provider,
										time: Tools.getDisplayDate(r.time),
										requestContextId:(r.msgs[0].msg.ex || {}).request_context_id,
										requestStatus:'--',
										status:r.status,
	                        		};
	                        		this.consumerTxList.push(respondResult);
	                        	});	 
	                        }
                        }
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerCN.message.callServiceListFailed'));
                }

			},
			consumerTxPageChange(pageNum) {
				this.consumerTxPageNum = pageNum;
				this.getConsumerTxList()
			},
			//响应记录
			async getRspondRecordList(){
			    try {
                    const res = await getRespondServiceRecord('',this.$route.params.param, this.respondRecordPageNum, this.respondRecordPageSize);
                    if(res){
                        console.log('RspondRecordList======:',res);
                        this.respondRecordCount = res.count;
                        this.respondRecordList = res.data || [];
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerCN.message.respondRecordFailed'));
                }

			},
			respondRecordPageChange(pageNum) {
				this.respondRecordPageNum = pageNum;
				this.getRspondRecordList()
			},
			//服务调用-提供者
			async getProviderTxList(){
			    try {
                    const res = await getRespondServiceWithAddress(this.$route.params.param, 1, 1000);
                    if(res){
                        console.log('ProviderTxList======:',res);
                        this.providerTxList = [];
                        for(let item of res.data){
                        	let result = {
                            	serviceName:(item.msgs[0].msg.ex || {}).service_name,
                            	provider:item.msgs[0].msg.provider,
                            	owner:item.msgs[0].msg.owner,
                                respond_times:item.respond_times,
                                pricing:JSON.parse(item.msgs[0].msg.pricing || '{}').price,
                                qos:item.msgs[0].msg.qos,
                                time: Tools.getDisplayDate(item.time),
                                unbindTime:item.unbinding_time ? Tools.getDisplayDate(item.unbinding_time) : '--',
                                txHash: item.tx_hash,
                                blockHeight: item.height,
                                txType: item.type,
                                status:item.status,
                            };
                            if (item.msgs[0].msg.deposit && item.msgs[0].msg.deposit.length) {
                                result.deposit = `${item.msgs[0].msg.deposit[0].amount} ${item.msgs[0].msg.deposit[0].denom}`;
                            }
                            let bindings = await getServiceBindingByServiceName(result.serviceName);
                            (bindings.result || []).forEach((bind)=>{
                                if(result.provider === bind.provider && result.owner == bind.owner){
                                    result.isAvailable = bind.available;
                                    result.pricing = JSON.parse(bind.pricing || '{}').price;
                                    result.qos = bind.qos;
                                    if (bind.disabled_time) {
                                    	let time = new Date(bind.disabled_time).getTime();
                                    	result.unbindTime = time>0 ? Tools.getDisplayDate(time/1000) : '--';
                                    }
                                }
                            })
                            if (result.pricing && result.pricing.length) {
                            	result.pricing = result.pricing.replace('point',' point');
                            }
                            this.providerTxList.push(result);
                        }
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerCN.message.providerServiceListFailed'));
                }

			},
			formatTxHash(TxHash){
				if(TxHash){
					return Tools.formatTxHash(TxHash)
				}else{
					return '--';
				}
			},
			formatAddress(address){
				return Tools.formatValidatorAddress(address) || '--';
			},
			getCallProviders(providers){
                if (providers && providers.length>2) {
                    return providers.slice(0, 2);
                }
                return providers;
            },
            getBgColorWithState(state){
            	let bgColor = '';
            	switch(state){
            		case 'running': bgColor = '#B1E96E'; break;
            		case 'completed': bgColor = '#FFC456'; break;
            		case 'paused': bgColor = '#E96E6E'; break;
            	}
            	return bgColor;
            },
            arraySpanMethod(table){
            	if (table.columnIndex === 0) {
            		if (table.row.isChildren) {
			          	if (table.row.index==0) {
			          		return {
				              rowspan: table.row.count,
				              colspan: 1
				            };
			          	}else{
			          		return {
				              rowspan: 0,
				              colspan: 0
				            };
			          	}
			        }else{
			          	return {
			              rowspan: 1,
			              colspan: 1
			            };
			        }
		        }

            },
            getRespondCount(count){
            	return this.$t('ExplorerCN.unit.totalRespond').replace(/\$\{\%value\%\}/, count);
            },
            handleSearchClick(){
            	this.type = this.type_temp;
            	this.status = this.status_temp;
                this.pageNum = 1;
                this.getTxByAddress();
            },
            resetFilterCondition(){
                this.type = '';
				this.status = '';
                this.pageNum = 1;
                this.getTxByAddress();
            },
            async getAllTxType(){
                try {
                    const res = await getAllServiceTxTypes();
                    res.data.forEach((type) =>{
                        this.txTypeOption.push({
                            value : type.typeName,
                            item : type.typeName,
                        });
                    });
                } catch (e) {
                    console.error(e);
                    // this.$message.error(this.$t('ExplorerCN.message.txTypeFailed'));
                }

            },
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.address_container_content{
		padding:0 0.15rem;
		.address_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.address_content_title {
		        display: flex;
		        justify-content: flex-start;
		        color: #171D44;
		        font-size: 0.18rem;
		        line-height: 0.21rem;
		        margin: 0.3rem 0 0.15rem 0.25rem;
		        text-align: left;
		        font-family:PingFangSC-Semibold,PingFang SC;
		        font-weight:600;
		        .address_content_title_first{
		            white-space: nowrap;
		            margin-right:0.05rem;
		        }
		        .address_content_title_address{
		            font-size:0.16rem;
		            font-family:ArialMT;
		            font-weight:400;
		            color:#171D44;
		            line-height:20px;
		            word-break: break-all;
		        }
		    }
			.address_asset_content{
				background:white;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid #D7D7D7;
			}

			.consumer_transaction_content{
				margin-top: 0.48rem;
				background:white;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid #D7D7D7;
				.consumer_transaction_content_hash{
					display: flex;
                    align-items: center;
				}
				.consumer_transaction_content_available{
					display: flex;
                    align-items: center;
                    .consumer_transaction_content_available_icon{
                    	width:0.1rem;
                    	height:0.1rem;
                    	border-radius:50%;
                    	margin-right:0.1rem;
                    	background:red;
                    }
				}
				.pagination_content{
					margin: 0.2rem 0 0.2rem 0;
					display: flex;
					justify-content: flex-end;
				}
			}
			.provider_transaction_content{
				margin-top: 0.48rem;
				background:white;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid #D7D7D7;
				.respond_transaction_content_hash{
					display: flex;
                    align-items: center;
				}
				.provider_transaction_content_available{
					display: flex;
                    align-items: center;
                    .provider_transaction_content_available_icon{
                    	width:0.1rem;
                    	height:0.1rem;
                    	border-radius:50%;
                    	margin-right:0.1rem;
                    }
				}
				.pagination_content{
					margin: 0.2rem 0 0.2rem 0;
					display: flex;
					justify-content: flex-end;
				}
			}

			.address_transaction_content{
				margin-top: 0.48rem;
				background:white;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid #D7D7D7;
				.address_transaction_content_hash{
					display: flex;
                    align-items: center;
				}
				.address_transaction_condition_container {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 0.4rem;
                    align-items: center;
                    .address_transaction_condition_count {
                        font-size: 0.14rem;
                        margin-right: 0.42rem;
                        font-weight: 600;

                    }
                    /deep/ .el-select {
                        width: 1.3rem;
                        margin-right: 0.22rem;
                        .el-input {
                            .el-input__inner {
                                padding-left: 0.07rem;
                                height: 0.32rem;
                                font-size: 0.14rem !important;
                                line-height: 0.32rem;
                                &::-webkit-input-placeholder {
                                    font-size: 0.14rem !important;
                                }
                            }
                            .el-input__inner:focus {
                                border-color: #3264FD !important;
                            }
                            .el-input__suffix {
                                .el-input__suffix-inner {
                                    .el-input__icon {
                                        line-height: 0.32rem;
                                    }
                                }
                            }
                        }
                        .is-focus {
                            .el-input__inner {
                                border-color: #3264FD !important;
                            }
                        }

                    }
                    .search_btn {
                        cursor: pointer;
                        background: #3264FD;
                        color: #fff;
                        border-radius: 0.04rem;
                        padding: 0.05rem 0.18rem;
                        font-size: 0.14rem;
                        line-height: 0.2rem;
                    }
                    .address_transaction_condition_action{
                    	display:flex;
                    	.reset_btn {
	                        background: #3264FD;
	                        color: #fff;
	                        border-radius: 0.04rem;
	                        margin-left: 0.1rem;
	                        cursor: pointer;
	                        i {
	                            padding: 0.08rem;
	                            font-size: 0.14rem;
	                            line-height: 1;
	                            display: inline-block;
	                        }
	                    }
                    }
                    
                }
                .pagination_content{
					margin: 0.2rem 0 0.2rem 0;
					display: flex;
					justify-content: flex-end;
				}
			}
			
			.content_title{
				color: #171D44;
				margin-bottom: 0.4rem;
				text-align: left;
				font-size:0.16rem;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				line-height:22px;
			}

			.status_icon{
                width:0.13rem;
                height:0.13rem;
                margin-right:0.05rem;
            }
		}
	}

	@media screen and (max-width: 768px) {
		.address_container_content{
			.address_content_wrap{
				.address_content_title {
			        .address_content_title_first{
			        }
			        .address_content_title_address{
			        }
			    }
				.address_asset_content{
				}
				.consumer_transaction_content{
					.consumer_transaction_content_hash{
					}
					.consumer_transaction_content_available{
	                    .consumer_transaction_content_available_icon{
	                    }
					}
					.pagination_content{
					}
				}
				.provider_transaction_content{
					.respond_transaction_content_hash{
					}
					.provider_transaction_content_available{
	                    .provider_transaction_content_available_icon{
	                    }
					}
					.pagination_content{
					}
				}

				.address_transaction_content{
					.address_transaction_content_hash{
					}
					.address_transaction_condition_container {
						flex-direction:column;
                        align-items: flex-start;
	                    .address_transaction_condition_count {
	                    	margin-bottom:0.1rem;
	                    }
	                    /deep/ .el-select {
	                    	width: 100%;
                            margin-bottom: 0.1rem;
	                        .el-input {
	                            .el-input__inner {
	                            }
	                            .el-input__inner:focus {
	                            }
	                            .el-input__suffix {
	                                .el-input__suffix-inner {
	                                    .el-input__icon {
	                                    }
	                                }
	                            }
	                        }
	                        .is-focus {
	                            .el-input__inner {
	                            }
	                        }
	                    }
	                    .search_btn {
	                    }
	                    .reset_btn {
	                        i {
	                        }
	                    }
	                }
	                .pagination_content{
					}
				}
				.content_title{
				}
				.status_icon{
	            }
			}
		}
	}
</style>

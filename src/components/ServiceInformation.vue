<template>
    <div class="service_information_container">
        <div class="service_information_content_wrap">
            <div class="service_information_definition_content">
                <h3 class="service_information_definition_title">{{$t('ExplorerCN.serviceDetail.serviceDefinition')}}
                    ({{$route.query.serviceName}})</h3>
                <div class="service_information_content">
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
                </div>
            </div>
            <div class="service_information_bindings_content">
                <h3 class="service_information_binding_title">
                    {{$t('ExplorerCN.serviceDetail.serviceBindings.serviceBindings')}}</h3>
                <div class="service_information_bindings_table_content">
                    <el-table :data="bindingArray">
                        <el-table-column min-width="100px" :label="$t('ExplorerCN.serviceDetail.serviceBindings.serviceName')"
                                         prop="serviceName"></el-table-column>
                        <el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.available')"
                                         prop="available"></el-table-column>
                        <el-table-column min-width="100px" :label="$t('ExplorerCN.serviceDetail.serviceBindings.deposit')"
                                         prop="deposit"></el-table-column>
                        <el-table-column min-width="120px" :label="$t('ExplorerCN.serviceDetail.serviceBindings.owner')">
                            <template slot-scope="scope">
                                <router-link :to="`/address/${scope.row.owner}`">{{formatAddress(scope.row.owner)}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" :label="$t('ExplorerCN.serviceDetail.serviceBindings.pricing')"
                                         prop="pricing"></el-table-column>
                        <el-table-column min-width="120px" :label="$t('ExplorerCN.serviceDetail.serviceBindings.provider')">
                            <template slot-scope="scope">
                                <router-link :to="`/address/${scope.row.provider}`">
                                    {{formatAddress(scope.row.provider)}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('ExplorerCN.serviceDetail.serviceBindings.qos')"
                                         prop="qos"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="service_information_transaction_content">
                <h3 class="service_information_transaction_title">
                    {{$t('ExplorerCN.serviceDetail.serviceTransactions')}}</h3>
                <div class="service_information_transaction_table_content">
                    <el-table :data="transactionArray">
                        <el-table-column min-width="100px" :label="$t('ExplorerCN.transactions.txHash')">
                            <template slot-scope="scope">
                                <router-link :to="`tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('ExplorerCN.transactions.block')">
                            <template slot-scope="scope">
                                <router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.requestId')">
                            <template slot-scope="scope">
                                <el-tooltip :content="scope.row.requestId" v-if="scope.row.requestId">
                                    <span>{{formatAddress(scope.row.requestId)}}</span>
                                </el-tooltip>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="130px" :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>

                        <el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.from')">
                            <template slot-scope="scope">
                                <router-link :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.to')">
                            <template slot-scope="scope">
                                <el-tooltip v-if="scope.row.content && scope.row.content.length > 0 ">
                                    <div slot="content">
                                        <div style="display: flex;flex-direction: column">
                                            <span v-for="item in scope.row.content">{{item}}</span>
                                        </div>
                                    </div>
                                    <span>{{scope.row.to}}</span>
                                </el-tooltip>
                                <router-link
                                        v-if="scope.row.to !== '' && scope.row.content && scope.row.content.length == 0"
                                        :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}
                                </router-link>
                                <span v-if="scope.row.to === ''">--</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('ExplorerCN.transactions.status')" prop="status"></el-table-column>

                        <el-table-column :label="$t('ExplorerCN.transactions.timestamp')" width="200px"
                                         prop="timestamp"></el-table-column>
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
    import Tools from "../util/Tools"
    import MPagination from "./MPagination";
    import { getServiceDetail, getServiceBindingTxList,getServiceTxList } from "../service/api";

    export default {
        name : "ServiceInformation",
        components : {MPagination},
        data(){
            return {
                from : '',
                chainId : '',
                publisher : '',
                description : '',
                idlContent : '',
                bindingArray : [],
                transactionArray : [],
                pageSize : 10,
                currentPageNum : 1,
                txCount : 0,
                author : '',
                authorDescription : '',
                name : '',
                schemas : '',
                tags : ''

            }
        },
        mounted(){
            this.getServiceInformation();
            this.getServiceBindingList();
            //this.getServiceTransaction()
            // this.getServiceTransaction()
        },
        methods : {
            pageChange(pageNum){
                this.currentPageNum = pageNum;
                this.getServiceTransaction();
            },
            async getServiceInformation(){

                const res = await getServiceDetail(this.$route.query.serviceName);

                try {
                    console.log(res)
                    if(res.msgs && res.msgs.length > 0 && res.msgs[0].msg){
                        const {author, author_description, description, name, schemas, tags} = res.msgs[0].msg;
                        this.author = author;
                        this.authorDescription = author_description ? author_description : '--';
                        this.description = description;
                        this.name = name;
                        this.schemas = schemas;
                        this.tags = tags;
                    }
                    this.getServiceTransaction();
                } catch (e) {
                    this.$message.error('获取service信息错误,请稍后重试');
                }
            },
            async getServiceBindingList(){
                try {
                    const res = await getServiceBindingTxList(this.$route.query.serviceName);
                    if(res){
                        this.bindingArray = res.result.map((item) =>{
                            return {
                                available : `${item.available ? item.available : 'false'}`,
                                deposit : `${item.deposit[0].amount} ${item.deposit[0].denom}`,
                                disabledTime : Tools.getDisplayDate(item.disabled_time),
                                owner : item.owner,
                                pricing : `${item.pricing}`,
                                provider : item.provider,
                                qos : item.qos,
                                serviceName : item.service_name,
                            }
                        })
                    }
                } catch (e) {
                    this.$message.error('获取service绑定交易列表错误,请稍后重试');
                }


            },
            async getServiceTransaction(){
                try {
                    const res = await getServiceTxList(this.currentPageNum,this.pageSize,this.$route.query.serviceName);
                    console.log(res)
                    this.transactionArray = res.data.map((item) =>{
                        let toAddressArray = [];
                        if(item.to.includes(',')){
                            toAddressArray = item.to.split(",")
                        }
                        return {
                            txType : item.type,
                            from : item.from ? item.from : '--',
                            signer : item.signer,
                            status : item.status === 1 ? 'Success' : 'Failed',
                            txHash : item.tx_hash,
                            requestId : item.msgs[0].msg.request_id,
                            to : toAddressArray.length > 0 ? `${toAddressArray.length} Address` : item.to,
                            content : toAddressArray,
                            height : item.height,
                            timestamp : Tools.getDisplayDate(item.time)
                        };

                    });
                    this.txCount = res.count;
                }catch (e) {
                    this.$message.error('获取service交易列表错误,请稍后重试');
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
    a {
        color: #3264FD !important;
    }

    .service_information_container {
        padding:0 0.15rem;
        .service_information_content_wrap {
            max-width: 12rem;
            margin: 0 auto;
            .service_information_definition_content {
                .service_information_definition_title {
                    margin: 0.3rem 0 0.1rem 0;
                    font-size: 0.18rem;
                    line-height: 0.21rem;
                    font-weight: bold;
                    color: #22252a;
                    text-align: left;
                    margin-left:0.2rem;
                }
                .service_information_content {
                    box-sizing: border-box;
                    padding: 0.2rem;
                    background: #fff;
                    .service_information_text_content {
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 0.16rem;
                        span:nth-of-type(1) {
                            font-size: 0.14rem;
                            line-height: 0.16rem;
                            color: #787C99;
                            min-width: 1.5rem;
                            text-align: left;
                        }
                        span:last-child {
                            font-size: 0.14rem;
                            line-height: 0.16rem;
                            color: #171D44;
                            flex: 1;
                            text-align: left;
                            word-break:break-all;
                        }
                    }
                    .service_information_text_content:last-child {
                        margin-bottom: 0;
                    }
                }
            }
            .service_information_bindings_content {
                .service_information_binding_title {
                    font-size: 0.18rem;
                    color: #22252A;
                    line-height: 0.21rem;
                    text-align: left;
                    text-indent: 0.2rem;
                    margin: 0.3rem 0 0.1rem 0;
                }
                .service_information_bindings_table_content {
                    background: #fff;
                }
            }
            .service_information_transaction_content {
                .service_information_transaction_title {
                    font-size: 0.18rem;
                    color: #22252A;
                    line-height: 0.21rem;
                    text-align: left;
                    text-indent: 0.2rem;
                    margin: 0.3rem 0 0.1rem 0;
                }
                .service_information_transaction_table_content {
                    background: #fff;
                }
            }
            .pagination_content {
                display: flex;
                justify-content: flex-end;
                margin: 0.1rem 0 0.2rem 0;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .service_information_container {
            
            .service_information_content_wrap {
                
                .service_information_definition_content {
                    .service_information_definition_title {
                        
                    }
                    .service_information_content {
                        
                        .service_information_text_content {
                            
                            span:nth-of-type(1) {
                                min-width: 1rem;
                            }
                            span:last-child {
                                
                            }
                        }
                        .service_information_text_content:last-child {
                            
                        }
                    }
                }
                .service_information_bindings_content {
                    .service_information_binding_title {
                        
                    }
                    .service_information_bindings_table_content {
                        
                    }
                }
                .service_information_transaction_content {
                    .service_information_transaction_title {
                        
                    }
                    .service_information_transaction_table_content {
                        
                    }
                }
                .pagination_content {
                    
                }
            }
        }
    }
</style>

<template>
    <div class="tx_detail_container">
        <div class="tx_detail_content_wrap">
            <div class="tx_detail_content">
                <div class="tx_detail_title">
                    <div class="tx_detail_title_first">
                        {{`${$t('ExplorerLang.transactionInformation.transactionInformation')} |`}}
                    </div>
                    <div class="tx_detail_title_hash">{{txHash}}</div>
                    <MClip :text="txHash"></MClip>
                </div>
                <div class="tx_information_content">
                    <p class="tx_information_list_title">{{$t('ExplorerLang.transactionInformation.baseInfo')}}</p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerLang.transactionInformation.blockHeight')}}：</span>
                        <span><router-link :to="`/block/${blockHeight}`">{{blockHeight}}</router-link></span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerLang.transactionInformation.status')}}：</span>
                        <span>{{status}}</span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerLang.transactionInformation.timestamp')}}：</span>
                        <span>{{timestamp}}</span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
                        <span style="word-break:break-all;"><router-link
                                :to="`/address/${signer}`">{{signer}}</router-link></span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerLang.transactionInformation.memo')}}：</span>
                        <span>{{memo}}</span>
                    </p>
                </div>
                <div class="tx_information_tx_message_content">

                    <div class="tx_information_tx_content">
                        <div class="tx_information_tx_message_title">
                            {{$t('ExplorerLang.transactionInformation.transactionMessage')}}
                        </div>
                        <div v-for="(item, index) in messages" :key="index">
                            <TxMessage :msg= "item" :events="events"/>
                            <div class="tx_information_tx_message_line" v-if="messages.length>1 && index != messages.length-1"></div>
                        </div>
                    </div>
                </div>
                <div class="tx_information_relevance_tx" v-if="txCount>0">
                    <div class="tx_information_relevance_tx_content">
                        <div class="tx_information_relevance_tx_title">
                            {{$t('ExplorerLang.transactionInformation.relevanceTx')}}
                        </div>
                        <div class="tx_information_relevance_tx_list_content">
                            <el-table class="table" :data="relevanceTxs"
                                      :empty-text="$t('ExplorerLang.table.emptyDescription')">
                                <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                                    <template slot-scope="scope">
                                        <div class="tx_information_relevance_tx_list_content_hash">
                                            <img class="service_tx_status"
                                                 :src="require(`../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
                                            <el-tooltip :content="scope.row.txHash"
                                                        class="item"
                                                        placement="top"
                                                        effect="dark">
                                                <router-link :to="`tx?txHash=${scope.row.txHash}`">
                                                    {{formatTxHash(scope.row.txHash)}}
                                                </router-link>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :min-width="ColumnMinWidth.txType"
                                                 :label="$t('ExplorerLang.table.txType')"
                                                 prop="txType"></el-table-column>
                                <el-table-column :min-width="ColumnMinWidth.requestId"
                                                 :label="$t('ExplorerLang.table.requestId')">
                                    <template slot-scope="scope">
                                        <span>{{formatAddress(scope.row.txType == TX_TYPE.call_service ? scope.row.requestContextId : scope.row.requestId)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
                                    <template slot-scope="scope">
                                        <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}
                                        </router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column :min-width="ColumnMinWidth.address"
                                                 :label="$t('ExplorerLang.table.provider')">
                                    <template slot-scope="scope">
                                        <router-link v-if="scope.row.txType==TX_TYPE.respond_service"
                                                     :to="`/address/${scope.row.provider}`">
                                            {{formatAddress(scope.row.provider)}}
                                        </router-link>
                                        <div v-else>
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
                                <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.time}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination_content" v-show="txCount > pageSize">
                            <keep-alive>
                                <m-pagination :page-size="Number(pageSize)"
                                              :total="txCount"
                                              :page="Number(pageNum)"
                                              :page-change="pageChange">
                                </m-pagination>
                            </keep-alive>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools";
    import MPagination from "./common/MPagination";
    import MClip from "./common/MClip.vue";
    import TxMessage from "./common/TxMessage.vue";
    import { getTxDetail, getRelevanceTxList } from "../service/api";
    import { TX_TYPE, TX_STATUS,ColumnMinWidth } from '../constant';
    export default {
        name : "TxDetail",
        components : {MPagination, MClip, TxMessage},
        data(){
            return {
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth,
                txHash : '',
                blockHeight : '',
                status : '',
                timestamp : '',
                signer : '',
                memo : '',
                txType : '',
                requestContextId : '',
                relevanceTxs : [],
                txCount : 0,
                pageNum : 1,
                pageSize : 10,
                messages:[],
                events:[],
            }
        },
        mounted(){
            this.getTransactionInformation()
        },
        methods : {
            async getTransactionInformation(){
                try {
                    const res = await getTxDetail(this.$route.query.txHash);
                    if(res){
                        this.messages = res.msgs;
                        this.events = res.events;
                        // console.log(res)
                        this.txHash = res.tx_hash || '--';
                        this.blockHeight = res.height || '--';
                        this.status = res.status === TX_STATUS.success ? 'Success' : 'Failed';
                        this.timestamp = Tools.getDisplayDate(res.time) || '--';
                        this.signer = res.signer || '--';
                        this.memo = res.memo ? res.memo : '--';
                        this.txType = res.msgs[0].type || '--';
                        switch (this.txType){
                            case TX_TYPE.mint_nft:break;
                            case TX_TYPE.burn_nft:break;
                            case TX_TYPE.create_record:break;
                            case TX_TYPE.define_service:break;
                            case TX_TYPE.bind_service:break;
                            case TX_TYPE.send:break;
                            case TX_TYPE.call_service:
                                res.events.forEach((item) =>{
                                    (item.attributes || []).forEach((attr) =>{
                                        if(attr.key == 'request_context_id'){
                                            this.requestContextId = attr.value || '--';
                                        }
                                    });
                                });
                                break;
                            case TX_TYPE.transfer_nft:break;
                            case TX_TYPE.edit_nft:break;
                            case TX_TYPE.issue_denom:break;
                            case TX_TYPE.respond_service:
                                this.requestContextId = (res.msgs[0].msg.ex || {}).request_context_id || '--';
                            break;
                            case TX_TYPE.pause_request_context:break;
                            case TX_TYPE.start_request_context:break;
                            case TX_TYPE.kill_request_context:break;
                            case TX_TYPE.update_request_context:break;
                            case TX_TYPE.update_service_binding: break;
                            case TX_TYPE.disable_service_binding:break;
                            case TX_TYPE.enable_service_binding:break;
                            case TX_TYPE.refund_service_deposit:break;
                            case TX_TYPE.recv_packet: break;
                        }
                        this.relevanceTxList();
                    }
                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            pageChange(pageNum){
                if(this.pageNum === pageNum) return;
                this.pageNum = pageNum;
                this.relevanceTxList();
            },
            async relevanceTxList(){
                let type = '';
                switch (this.txType){
                    case TX_TYPE.call_service:
                        type = TX_TYPE.respond_service;
                        break;
                    case TX_TYPE.respond_service:
                        type = TX_TYPE.call_service;
                        break;
                }
                console.log(this.TxType, '///', type, '///', this.requestContextId);
                if(type && type.length && this.requestContextId && this.requestContextId.length){
                    try {
                        const res = await getRelevanceTxList(type, this.requestContextId, this.pageNum, this.pageSize, true);
                        if(res){
                            this.txCount = res.count;
                            this.relevanceTxs = res.data.map((tx) =>{
                                let result = {
                                    status : tx.status,
                                    txHash : tx.tx_hash,
                                    txType : tx.type,
                                    blockHeight : tx.height,
                                    time : Tools.getDisplayDate(tx.time),
                                };
                                switch (tx.type){
                                    case TX_TYPE.call_service:
                                        result.provider = tx.msgs[0].msg.providers;
                                        tx.events.forEach((item) =>{
                                            (item.attributes || []).forEach((attr) =>{
                                                if(attr.key == 'request_context_id'){
                                                    result.requestContextId = attr.value;
                                                }
                                            });
                                        });
                                        break;
                                    case TX_TYPE.respond_service:
                                        result.provider = tx.msgs[0].msg.provider;
                                        result.requestId = tx.msgs[0].msg.request_id;
                                        break;
                                }
                                return result;
                            });
                        }
                        console.log('=========:', this.relevanceTxs);
                    } catch (e) {
                        console.error(e);
                    }
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
            getCallProviders(providers){
                if(providers && providers.length > 2){
                    return providers.slice(0, 2);
                }
                return providers;
            }
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }

    .tx_detail_container {
        padding: 0 0.15rem;
        .tx_detail_content_wrap {
            max-width: 12rem;
            margin: 0 auto;
            .tx_detail_content {
                .tx_detail_title {
                    display: flex;
                    justify-content: flex-start;
                    color: $t_first_c;
                    font-size: $s18;
                    line-height: 0.21rem;
                    margin: 0.3rem 0 0.15rem 0.25rem;
                    text-align: left;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    .tx_detail_title_first {
                        white-space: nowrap;
                        margin-right: 0.05rem;
                    }
                    .tx_detail_title_hash {
                        font-size: $s14;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: $t_first_c;
                        line-height: 0.2rem;
                        word-break: break-all;
                        margin-right:0.05rem;
                    }
                }
                .tx_information_content {
                    box-sizing: border-box;
                    padding: 0.25rem;
                    background: $bg_white_c;
                    text-align: left;
                    border-radius: 0.05rem;
                    border: 1px solid $bd_first_c;
                    .tx_information_list_title {
                        font-size: $s16;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: $t_first_c;
                        line-height: 22px;
                        margin-bottom: 0.48rem;
                    }
                    .tx_information_list_item {
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 0.26rem;
                        span:nth-of-type(1) {
                            margin-right:0.15rem;
                            text-align: left;
                            min-width: 1.5rem;
                            color: $t_second_c;
                            font-size: $s14;
                            line-height: 0.16rem;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                        }
                        span:nth-of-type(2) {
                            text-align: left;
                            flex: 1;
                            color: $t_first_c;
                            font-size: $s14;
                            line-height: 0.16rem;
                        }
                    }
                    .tx_information_list_item:last-child {
                        margin-bottom: 0;
                    }
                }
                .tx_information_tx_message_content {
                    margin: 0.48rem 0 0.1rem 0;
                    .tx_information_tx_content {
                        box-sizing: border-box;
                        padding: 0.25rem;
                        background: $bg_white_c;
                        border-radius: 0.05rem;
                        border: 1px solid $bd_first_c;
                        .tx_information_tx_message_title {
                            text-align: left;
                            font-size: $s16;
                            font-weight: bold;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                        }
                        .tx_information_tx_message_line{
                            height:0.01rem;
                            background:$bd_first_c;
                        }
                    }

                }
                .tx_information_relevance_tx {
                    margin: 0.48rem 0 0.1rem 0;
                    .tx_information_relevance_tx_content {
                        box-sizing: border-box;
                        padding: 0.25rem;
                        background: $bg_white_c;
                        border-radius: 0.05rem;
                        border: 1px solid $bd_first_c;
                        .tx_information_relevance_tx_title {
                            text-align: left;
                            font-size: $s16;
                            font-weight: bold;
                            margin-bottom: 0.48rem;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                        }
                        .tx_information_relevance_tx_list_content {
                            .tx_information_relevance_tx_list_content_hash {
                                display: flex;
                                align-items: center;
                                .service_tx_status {
                                    width: 0.13rem;
                                    height: 0.13rem;
                                    margin-right: 0.05rem;
                                }
                            }

                        }
                        .pagination_content {
                            display: flex;
                            justify-content: flex-end;
                            margin: 0.1rem 0 0.2rem 0;
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        .tx_detail_container {
            .tx_detail_content_wrap {

                .tx_detail_content {
                    .tx_detail_title {

                    }
                    .tx_information_content {

                        .tx_information_list_item {

                            span:nth-of-type(1) {
                                min-width: 1rem;
                            }
                            span:nth-of-type(2) {

                            }
                        }
                        .tx_information_list_item:last-child {

                        }
                    }
                    .tx_information_tx_message_content {
                        .tx_information_tx_message_title {

                        }
                    }
                }
            }
        }
    }
</style>

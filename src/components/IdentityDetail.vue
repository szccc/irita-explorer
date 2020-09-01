<template>
    <div class="identity_detail_container">
        <div class="identity_detail_content_wrap">
            <div class="identity_detail_title">
                <div class="identity_detail_title_first">
                    {{`${$t('ExplorerLang.identityDetail.title')} |`}}
                </div>
                <div class="identity_detail_title_hash">{{id}}</div>
                <MClip :text="id"></MClip>
            </div>
            <div class="identity_information_content">
                <p class="content_title">{{$t('ExplorerLang.identityDetail.baseInfo')}}</p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.owner')}}：</span>
                    <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.credentials')}}：</span>
                    <a :href="formatUrl(credentials)" target="_blank">{{credentials}}</a>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.createTxHash')}}：</span>
                    <span><router-link :to="`/tx?txHash=${createTxHash}`">{{createTxHash}}</router-link></span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.createHeight')}}：</span>
                    <span><router-link :to="`/block/${createHeight}`">{{createHeight}}</router-link></span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.createTime')}}：</span>
                    <span>{{createTime}}</span>
                </p>
            </div>  
            <div class="identity_detail_bg">
                <div class="content_title">{{$t('ExplorerLang.identityDetail.credentialsInfo')}}</div>
                <el-table class="table" :data="pubkeyList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :min-width="ColumnMinWidth.idPubKeyFull" :label="$t('ExplorerLang.table.idPubkey')">
                        <template slot-scope="scope">
                            <span>{{scope.row.pubkey}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.pubKeyAlgo" :label="$t('ExplorerLang.table.pubKeyAlgo')">
                        <template slot-scope="scope">
                            <span>{{scope.row.pubKeyAlgo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.txHash"
                                        placement="top">
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')">
                        <template slot-scope="scope">
                            <span>{{scope.row.time}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination_content" v-if="pubkeyListCount > pubkeyListPageSize">
                    <m-pagination :page-size="pubkeyListPageSize"
                                  :total="pubkeyListCount"
                                  :page="pubkeyListPageNum"
                                  :page-change="pubkeyPageChange">
                    </m-pagination>
                </div>
                <div v-else style="height:30px"></div>
                <el-table class="table" :data="certificateList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :min-width="ColumnMinWidth.certificateFull" :label="$t('ExplorerLang.table.certificate')">
                        <template slot-scope="scope">
                            <LargeString :text="scope.row.certificate" mode="cell" textWidth="550px" :maxLength="Number(60)"/>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.txHash"
                                        placement="top">
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                        <template slot-scope="scope">
                            <span>{{Tools.getDisplayDate(scope.row.time)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination_content" v-if="certificateListCount > certificateListPageSize">
                    <m-pagination :page-size="certificateListPageSize"
                                  :total="certificateListCount"
                                  :page="certificateListPageNum"
                                  :page-change="certificatePageChange">
                    </m-pagination>
                </div>
            </div>   
            <div class="identity_detail_bg">
                <div class="content_title">{{$t('ExplorerLang.identityDetail.txRecord')}}</div>
                <el-table class="table" :data="txList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                        <template slot-scope="scope">
                            <div class="tx_transaction_content_hash">
                                <img class="status_icon"
                                             :src="require(`../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
                                <el-tooltip :content="scope.row.txHash"
                                            placement="top"
                                            :disabled="!Tools.isValid(scope.row.txHash)">
                                    <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')">
                        <template slot-scope="scope">
                            <span>{{scope.row.txType}}</span>
                            <span v-show="Number(scope.row.msgCount) > 1">{{$t('ExplorerLang.unit.ellipsis')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.from')">
                        <template slot-scope="scope">
                            <el-tooltip v-if="Number(scope.row.msgCount) <= 1" :content="scope.row.from"
                                        placement="top"
                                        :disabled="!Tools.isValid(scope.row.from)">
                                <router-link v-if="Tools.isValid(scope.row.from)" :to="`/address/${scope.row.from}`">
                                    {{formatAddress(scope.row.from)}}
                                </router-link>
                                <span v-else>{{'--'}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
                        <template slot-scope="scope">
                            <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                        <template slot-scope="scope">
                            <span>{{scope.row.time}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination_content" v-if="txListCount > txListPageSize">
                    <m-pagination :page-size="txListPageSize"
                                  :total="txListCount"
                                  :page="txListPageNum"
                                  :page-change="txPageChange">
                    </m-pagination>
                </div>
            </div>           
        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools";
    import MPagination from "./common/MPagination";
    import MClip from "./common/MClip.vue";
    import TxListComponent from "./common/TxListComponent";
    import { getTxDetail, 
            getRelevanceTxList, 
            getIdentityDetail,
            getPubkeyListByIdentity,
            getCertificateListByIdentity,
            getTxListByIdentity} from "../service/api";
    import { TX_TYPE, TX_STATUS,ColumnMinWidth } from '../constant';
    import LargeString from './common/LargeString';
    export default {
        name : "TxDetail",
        components : {MPagination, MClip, TxListComponent, LargeString},
        data(){
            return {
                Tools,
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth,
                id:this.$route.params.id,
                owner: '',
                credentials: '',
                createTxHash: '',
                createHeight: '',
                createTime: '',
                pubkeyList:[],
                pubkeyListPageNum:1,
                pubkeyListPageSize: 5,
                pubkeyListCount:0,
                certificateList:[],
                certificateListPageNum:1,
                certificateListPageSize: 5,
                certificateListCount:0,
                txList:[],
                txListPageNum:1,
                txListPageSize: 5,
                txListCount:0,
                
            }
        },
        mounted(){
            this.getIdentityDetail();
            this.getPubkeyList();
            this.getCertificateList();
            this.getTxList();
        },
        methods : {
            async getIdentityDetail(){
                try {
                    this.owner = 'iaa1ze43pja24lk5mafu42lq7wnpjkjnszk742jtah';
                    this.credentials = 'www.baidu.com';
                    this.createTxHash = 'A879B06D8E841A25BEF266FA65116718753A69A4729A11EBA9D3183172BD47C3';
                    this.createHeight = '64119';
                    this.createTime = Tools.getDisplayDate('1598595881');
                    // const res = await getIdentityDetail(this.id);
                    // if(res){
                        
                    // }
                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            pubkeyPageChange(pageNum){
                if(this.pubkeyListPageNum === pageNum) return;
                this.pubkeyListPageNum = pageNum;
                this.getPubkeyList();
            },
            certificatePageChange(pageNum){
                if(this.certificateListPageNum === pageNum) return;
                this.certificateListPageNum = pageNum;
                this.getCertificateList();
            },
            txPageChange(pageNum){
                if(this.txListPageNum === pageNum) return;
                this.txListPageNum = pageNum;
                this.getTxList();
            },
            async getPubkeyList(){
                try {
                    this.pubkeyList = [{
                        pubkey: 'cMAnBkMQswCQYDVQQKDAJiajELMAkGA1UE CwwCY',
                        pubKeyAlgo: 'ED25519',
                        txHash: 'BA7965368E16B9E93786562D533853DB525A4B9644219ADA41BA3D987EF82D50',
                        time: Tools.getDisplayDate('1598595875'),
                    }];
                    // const res = await getPubkeyListByIdentity(this.id, this.pubkeyListPageNum, this.pubkeyListPageSize, true);
                    // if(res){
                    //     this.pubkeyListCount = res.count;
                    //     this.pubkeyList = res.data.map((tx) =>{
                    //         let result = {
                    //         };
                    //         return result;
                    //     });
                    // }
                } catch (e) {
                    console.error(e);
                }
            },
            async getCertificateList(){
                try {
                    this.certificateList = [{
                        certificate: '-----BEGIN CERTIFICATE----- MIIDTDCCAjQCCQDvRoz+e/HRpDANBgkqhkiG9w0BAQsFADBoMQswCQYDVQQGEwJj bjELMAkGA1UECAwCc2gxCzAJBgNVBAcMAnBkMQswCQYDVQQKDAJiajELMAkGA1UE CwwCYmoxCzAJBgNVBAMMAmJqMRgwFgYJKoZIhvcNAQkBFgliakBiai5jb20wHhcN MjAwNjEwMDkzNjMxWhcNMjAwNzEwMDkzNjMxWjBoMQswCQYDVQQGEwJjbjELMAkG A1UECAwCc2gxCzAJBgNVBAcMAnBkMQswCQYDVQQKDAJiajELMAkGA1UECwwCYmox CzAJBgNVBAMMAmJqMRgwFgYJKoZIhvcNAQkBFgliakBiai5jb20wggEiMA0GCSqG SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDUEifXes1/CXEjdH8SeSS+1x+ZlhktI8i8 9ncMeOr5oI1Mc7Kd7v85i0hrmjjZzUrHQy0Sdt2ltQjo6dtkq3wDsL4OgIqGO75z OwG4EB0A1sJ/YTSX+fmWwy5ys19A2O5sTZOJEw3VFgiZHv1TZEiY+GVtpZ5Dti/1 t5ZzNTF+M0rpbICTxLh1GSpdhJs95yci1A8zqmPzPETVkxJwVCOg54WfpRQAiBqM DKLjVXALuvlDDxVhB0u7kuvKAydZdV/pDs73HuY2srCOiDij3iVS01Ln02JNeMK8 IG9xRSw2eaSDp+fa1jtUXMDMmVNHCJqpQaFv0/1oN/ehUXb/DTMHAgMBAAEwDQYJ KoZIhvcNAQELBQADggEBAKij8eUTcs+AJFPnzc3aolVZEApwvLum58WRjmoev44A 1528F4dXF7vJhIbqdOvEBy0YNQhNuNUs+JiHIFwuVvhNuAXDgXJNsvymx8fn0E5U C90iTCiV9WhlL93S6fSelDj65sgD4Gw8Q4bBbNa/SRCu4+oBNS9BPjpcbrGllph9 7AkCGBiaabVLqGNyZJEKZpRQ3kOqdQzHYT/eHRC3hcO/KGf0vCOUTgEhHuYavMy/ JZOeFg1owNP2nZ8cD2TwDKS+T+T1rAG1ovnVp/PV7lbH1o8Kn2rwtj1S42O824Gr 2NyVhhdZkLI/uEX9mdmcFPB+oV6iiPnqEh/r2wswFgw= -----END CERTIFICATE-----',
                        txHash: 'BA7965368E16B9E93786562D533853DB525A4B9644219ADA41BA3D987EF82D50',
                        time: Tools.getDisplayDate('1598595875'),
                    }];
                    // const res = await getCertificateListByIdentity(this.id, this.certificateListPageNum, this.certificateListPageSize, true);
                    // if(res){
                    //     this.certificateListCount = res.count;
                    //     this.certificateList = res.data.map((tx) =>{
                    //         let result = {
                    //         };
                    //         return result;
                    //     });
                    // }
                } catch (e) {
                    console.error(e);
                }
            },
            async getTxList(){
                try {
                    this.txList = [{
                        txHash: 'BA7965368E16B9E93786562D533853DB525A4B9644219ADA41BA3D987EF82D50',
                        txType: 'create_identity',
                        from: 'iaa1c6n6xxz6qs2s60f9dzmnw2zwqjv04kah4sjv64',
                        blockHeight: '62312',
                        time: Tools.getDisplayDate('1598595875'),
                        msgCount:1,
                        status:1
                    }];
                    // const res = await getTxListByIdentity(this.id, this.txListPageNum, this.txListPageSize, true);
                    // if(res){
                    //     this.txListCount = res.count;
                    //     this.txList = res.data.map((tx) =>{
                    //         let result = {
                    //         };
                    //         return result;
                    //     });
                    // }
                } catch (e) {
                    console.error(e);
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
            formatUrl(url){
                if (!(/^http:\/\/|^https:\/\//).test(url)) {
                    return `http://${url}`;
                }
                return url;
            }
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }

    .identity_detail_container {
        padding: 0 0.15rem;
        .identity_detail_content_wrap {
            max-width: 12rem;
            margin: 0 auto 0.4rem auto;
            .identity_detail_title {
                display: flex;
                justify-content: flex-start;
                color: $t_first_c;
                font-size: $s18;
                line-height: 0.21rem;
                margin: 0.3rem 0 0.15rem 0.25rem;
                text-align: left;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                .identity_detail_title_first {
                    white-space: nowrap;
                    margin-right: 0.05rem;
                }
                .identity_detail_title_hash {
                    font-size: $s14;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: $t_first_c;
                    line-height: 0.2rem;
                    word-break: break-all;
                    margin-right:0.05rem;
                }
            }
            .identity_information_content {
                box-sizing: border-box;
                padding: 0.25rem;
                background: $bg_white_c;
                text-align: left;
                border-radius: 0.05rem;
                border: 1px solid $bd_first_c;
                .identity_information_list_item {
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
                .identity_information_list_item:last-child {
                    margin-bottom: 0;
                }
            }  
            .identity_detail_bg{
                margin-top:0.48rem;
                background: $bg_white_c;
                padding:0.25rem;
                border-radius:0.05rem;
                border:1px solid $bd_first_c;
            }            
            .content_title{
                color: $t_first_c;
                margin-bottom: 0.4rem;
                text-align: left;
                font-size: $s16;
                font-family:PingFangSC-Semibold,PingFang SC;
                font-weight:600;
                line-height:22px;
            }
            .pagination_content{
                margin: 0.2rem 0 0.2rem 0;
                display: flex;
                justify-content: flex-end;
            }
            .status_icon{
                width:0.13rem;
                height:0.13rem;
                margin-right:0.05rem;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .identity_detail_container {
            .identity_detail_content_wrap {
                
                .identity_detail_title {
                    
                    .identity_detail_title_first {
                        
                    }
                    .identity_detail_title_hash {
                       
                    }
                }
                .identity_information_content {
                    
                    .identity_information_list_item {
                        
                        span:nth-of-type(1) {
                            min-width: 1rem;
                        }
                        span:nth-of-type(2) {
                            
                        }
                    }
                    .identity_information_list_item:last-child {
                    }
                }  
                .identity_detail_bg{
                    
                }            
                .content_title{
                    
                }
                .pagination_content{
                    
                }
                .status_icon{
                    
                }
            }
        }
    }
</style>

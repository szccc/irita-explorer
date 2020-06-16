<template>
    <div class="tx_content_container">
        <div class="tx_content_wrap">
            <div class="tx_content_header_wrap">
                <div class="total_tx_content">{{txCount}} {{$t('ExplorerCN.transactions.txs')}}</div>
                <div class="filer_content">
                    <div class="tx_type_mobile_content">
                        <!--<el-select v-model="value" filterable :change="filterTxByTxType(value)">
                            <el-option v-for="(item, index) in txTypeOption"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>-->
                        <el-select v-model="txType">
                            <el-option v-for="(item, index) in txTypeOption"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>


                        <!--<el-select v-model="statusValue" :change="filterTxByStatus(statusValue)">
                            <el-option v-for="(item, index) in statusOpt"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>-->
                        <el-select v-model="statusValue">
                            <el-option v-for="(item, index) in statusOpt"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>

                    </div>
                    <div class="tx_type_mobile_content">
                        <el-date-picker type="date"
                                        v-model="beginTime"
                                        @change="getStartTime(beginTime)"
                                        :editable="false"
                                        value-format="yyyy-MM-dd"
                                        placeholder="Select Date">
                        </el-date-picker>
                        <span class="joint_mark">~</span>
                        <el-date-picker type="date"
                                        v-model="endTime"
                                        value-format="yyyy-MM-dd"
                                        @change="getEndTime(endTime)"
                                        :editable="false"
                                        placeholder="Select Date">
                        </el-date-picker>
                    </div>
                    <div class="tx_type_mobile_content">
                        <div class="search_btn" @click="getFilterTxs">{{$t('ExplorerCN.transactions.search')}}</div>
                        <div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
                    </div>
                </div>
            </div>
            <div class="tx_list_content">
                <el-table :data="transactionArray">
                    <el-table-column :label="$t('ExplorerCN.transactions.txHash')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.txHash"
                                        class="item"
                                        placement="top"
                                        effect="dark">
                                <router-link :to="`tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}
                                </router-link>
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
                            <el-tooltip :content="scope.row.from"
                                        class="item"
                                        placement="top"
                                        effect="dark">
                                <router-link v-if="scope.row.from !== '--'" :to="`/address/${scope.row.from}`">
                                    {{formatAddress(scope.row.from)}}
                                </router-link>
                            </el-tooltip>
                            <span v-if="scope.row.from === '--'">{{formatAddress(scope.row.from)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('ExplorerCN.transactions.to')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.to"
                                        class="item"
                                        placement="top"
                                        effect="dark">
                                <router-link v-if="scope.row.to !== '--'" :to="`/address/${scope.row.to}`">
                                    {{formatAddress(scope.row.to)}}
                                </router-link>
                            </el-tooltip>
                            <span v-if="scope.row.to === '--'">{{formatAddress(scope.row.to)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('ExplorerCN.transactions.signer')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.signer"
                                        class="item"
                                        placement="top"
                                        effect="dark">
                                <router-link :to="`/address/${scope.row.signer}`">{{formatAddress(scope.row.signer)}}
                                </router-link>
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
            <div class="pagination_content">
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
</template>

<script>
    import Server from "../service"
    import Tools from "../util/Tools"
    import MPagination from "./MPagination";
    import { HttpHelper } from '../helper/httpHelper';
    import moment from 'moment';

    export default {
        name : "TxList",
        components : {MPagination},
        data(){
            const {txType, status, beginTime, endTime, pageNum, pageSize} = Tools.urlParser();

            return {
                transactionArray : [],
                txCount : 0,
                txTypeOption : [],
                statusOpt : [
                    {
                        value:'',
                        label:'All Status'
                    },
                    {
                        value:1,
                        label:'Success'
                    },
                    {
                        value:2,
                        label:'Failed'
                    }
                ],
                statusValue : status ? status : '',
                txType : txType ? txType : '',
                beginTime : beginTime ? beginTime : '',
                endTime : endTime ? endTime : '',
                /*filterStartTime : '',
                filterEndTime : '',
                urlParamsShowStartTime : this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
                urlParamsShowEndTime : this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',*/
                txStatus : '',
                pageNum: pageNum ? pageNum : 1,
                pageSize: pageSize ? pageSize : 10,
            }
        },
        mounted(){
            this.getFilterTxs();
            this.getAllTxType();
        },
        methods : {
            getFilterTxs(){
                this.pageNum = 1;
                let url = `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&useCount=true`;
                if(this.txType){
                    url += `&type=${this.txType}`;
                }
                if(this.statusValue){
                    url += `&status=${this.statusValue}`;
                }
                if(this.beginTime){
                    url += `&beginTime=${this.beginTime}`;
                }
                if(this.endTime){
                    url += `&endTime=${this.endTime}`;
                }
                history.pushState(null, null, url);
                this.getTxList();
            },
            /*filterTxByTxType(e){
                if(e === 'allTxType' || e === undefined){
                    this.TxType = ''
                } else {
                    this.TxType = e
                }
            },*/
            resetUrl(){
                this.beginTime = '';
                this.endTime = '';
                this.txType = '';
                this.statusValue = '';
                this.txStatus = '';
                this.beginTime = '';
                this.endTime = '';
                history.pushState(null, null, `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&useCount=true`);
            },
            async getTxList(){
                console.log(Tools.urlParser())
                const {txType, status, beginTime, endTime, pageNum, pageSize} = Tools.urlParser();
                let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
                if(txType){
                    url += `&type=${txType}`;
                }
                if(status){
                    url += `&status=${status}`;
                }
                if(beginTime){
                    url += `&beginTime=${moment(this.beginTime).startOf('d').unix()}`;
                }
                if(endTime){
                    url += `&endTime=${moment(this.beginTime).endOf('d').unix()}`;
                }
                console.log('query tx url', url);

                const res = await HttpHelper.get(url);
                if(res && res.code === 0){
                    this.transactionArray = res.data.data.map((tx)=>{
                        return {
                            txHash : tx.tx_hash,
                            blockHeight : tx.height,
                            txType : tx.type,
                            from : tx.from ? tx.from : '--',
                            to : tx.to ? tx.to : '--',
                            signer : tx.signer,
                            status : tx.status === 1 ? 'Success' : 'Failed',
                            time :Tools.getDisplayDate(tx.time),
                        }
                    });
                    this.txCount = res.data.count;

                    console.log(this.transactionArray)
                } else if(res.code){

                } else {

                }
            },
            async getAllTxType(){
                const res = await HttpHelper.get(`txs/types`);
                if(res && res.code === 0){
                    const typeList = res.data.data.map((type)=>{
                        return {
                            value: type.typeName,
                            item:type.typeName,
                        }
                    });
                    typeList.unshift({
                        value : '',
                        label : 'All TxType',
                        slot : 'allTxType'
                    });
                    this.txTypeOption = typeList;
                } else if(res.code){

                } else {

                }
            },
            /*filterTxByStatus(e){
                if(e === '' || e === undefined){
                    this.txStatus = ''
                } else {
                    this.txStatus = e
                }
            },*/
            getStartTime(time){
                this.beginTime = time;
            },
            getEndTime(time){
                this.endTime =time;
            },
            /*formatEndTime(time){

                // let utcTime = Tools.conversionTimeToUTCByValidatorsLine(new Date(time).toISOString());
                let oneDaySeconds = 24 * 60 * 60;
                return Number(new Date(time).getTime() / 1000) + Number(oneDaySeconds)
            },
            formatStartTime(time){
                // let utcTime = Tools.conversionTimeToUTCByValidatorsLine(new Date(time).toISOString());
                return Number(new Date(time).getTime() / 1000)
            },*/
            resetFilterCondition(){
                this.txType = '';
                this.statusValue = '';
                this.beginTime = '';
                this.endTime = '';
                this.pageNum = 1;
                this.pageSize = 10;
                this.resetUrl();
                this.getTxList()
            },
            /*getParamsByUrlHash(){
                let txType,
                    txStatus,
                    filterStartTime,
                    urlParamShowStartTime,
                    urlParamShowEndTime,
                    filterEndTime;
                let path = window.location.hash;
                if(path.includes("?")){
                    let urlHash = path.split('?')[1];
                    let params = urlHash.split("&");
                    params.forEach(item =>{
                        if(item.includes('txType')){
                            txType = item.split("=")[1]
                        } else if(item.includes('status')){
                            txStatus = item.split("=")[1]
                        } else if(item.includes('beginTime')){
                            urlParamShowStartTime = item.split("=")[1]
                            filterStartTime = this.formatStartTime(item.split("=")[1])
                        } else if(item.includes('endTime')){
                            urlParamShowEndTime = item.split("=")[1]
                            filterEndTime = this.formatEndTime(item.split("=")[1])
                        }
                    })
                }
                return {txType, txStatus, filterStartTime, filterEndTime, urlParamShowStartTime, urlParamShowEndTime}
            },*/
            pageChange(pageNum){
                if(this.pageNum === pageNum) return;
                this.pageNum = pageNum;

                /*let urlParams = this.getParamsByUrlHash();
                this.statusValue = urlParams.txStatus ? urlParams.txStatus : '';
                this.txType = urlParams.txType ? urlParams.txType : 'allTxType';
                this.beginTime = urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : '';
                this.endTime = urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : '';*/

                const {txType, status, beginTime, endTime, pageSize} = Tools.urlParser();
                let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
                if(txType){
                    url += `&type=${txType}`;
                }
                if(status){
                    url += `&status=${status}`;
                }
                if(beginTime){
                    url += `&beginTime=${beginTime}`;
                }
                if(endTime){
                    url += `&endTime=${endTime}`;
                }
                history.pushState(null, null, url);
                this.getTxList();
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

    .tx_content_container {
        .tx_content_wrap {
            max-width: 12rem;
            margin: 0 auto;
            .tx_content_header_wrap {
                display: flex;
                justify-content: flex-start;
                .total_tx_content {
                    height: 0.61rem;
                    line-height: 0.61rem;
                    color: #22252A;
                    font-size: 0.18rem;
                    font-weight: bold;
                    margin-right: 0.2rem;
                    text-indent: 0.2rem;
                }
                .filer_content {
                    display: flex;
                    align-items: center;
                    .tx_type_mobile_content {
                        display: flex;
                        align-items: center;

                        /deep/ .el-select {
                            width: 1.3rem;
                            margin-right: 0.1rem;
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
                        /deep/ .el-date-editor {
                            width: 1.3rem;
                            .el-icon-circle-close {
                                display: none !important;
                            }
                            .el-input__inner {
                                height: 0.32rem;
                                padding-left: 0.07rem;
                                padding-right: 0;
                                line-height: 0.32rem;
                                &::-webkit-input-placeholder {
                                    font-size: 0.14rem !important;
                                }
                                &:focus {
                                    border-color: #3264FD;
                                }
                            }
                            .el-input__prefix {
                                right: 5px;
                                left: 1rem;
                                .el-input__icon {
                                    line-height: 0.32rem;
                                }
                            }
                        }
                        .joint_mark {
                            margin: 0 0.08rem;
                        }
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
                        .search_btn {
                            cursor: pointer;
                            background: #3264FD;
                            margin-left: 0.1rem;
                            color: #fff;
                            border-radius: 0.04rem;
                            padding: 0.05rem 0.18rem;
                            font-size: 0.14rem;
                            line-height: 0.2rem;
                        }
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
</style>

<template>
    <div class="tx_list_content">
        <el-table class="table" :data="txDataList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
            <el-table-column class-name="hash_status" align="left" :width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                <template slot-scope="scope">
                    <div class="tx_transaction_content_hash">
                        <div class="status">
                            <img class="status_icon"
                                     :src="require(`../../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
                        </div>
                        <el-tooltip :content="scope.row.txHash"
                                    placement="top"
                                    :disabled="!isValid(scope.row.txHash)">
                            <div>
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </div>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
                <template slot-scope="scope">
                    <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.txType.join(',')"
                                placement="top"
                                :disabled="scope.row.txType.length <= 1">
                        <span>{{getDisplayTxType(scope.row.txType) }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" :min-width="ColumnMinWidth.message" :label="$t('ExplorerLang.table.message')">
                <template slot-scope="scope">
                    <span>{{scope.row.msgCount}} {{$t('ExplorerLang.unit.msgCountUnit')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="Tx_Fee" :label="$t('ExplorerLang.table.fee')" :min-width="ColumnMinWidth.fee"></el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.from')">
                <template slot-scope="scope">
                    <el-tooltip v-if="isValid(scope.row.from)" v-show="Number(scope.row.msgCount) <= 1" :content="scope.row.from"
                                placement="top"
                                :disabled="!isValid(scope.row.from)">
                        <span v-if="isValid(scope.row.from) && address !== scope.row.from " class="address_link" @click="addressRoute(scope.row.from)">
                            {{  formatMoniker(scope.row.fromMonikers,monikerNum.otherTable) || formatAddress(scope.row.from)}}
                        </span>
                        <span v-else>
                            {{  formatMoniker(scope.row.fromMonikers,monikerNum.otherTable) || formatAddress(scope.row.from)}}
                        </span>
                    </el-tooltip>
                    <span v-if="!isValid(scope.row.from) || Number(scope.row.msgCount) > 1 ">--</span>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.to')">
                <template slot-scope="scope">
                    <el-tooltip v-show="Number(scope.row.msgCount) <= 1" :content="String(scope.row.to)"
                                placement="top"
                                :key="Math.random()"
                                :disabled="!isValid(scope.row.to) || Array.isArray(scope.row.to)">
                        <span v-if="typeof scope.row.to=='string' && isValid(scope.row.to) && address !== scope.row.to" class="address_link" @click="addressRoute(scope.row.to)">
                            {{ formatMoniker(scope.row.toMonikers,monikerNum.otherTable) || formatAddress(scope.row.to)}}
                        </span>
                        <span v-else-if="typeof scope.row.to=='string' && isValid(scope.row.to) && address === scope.row.to">
                            {{ formatMoniker(scope.row.toMonikers,monikerNum.otherTable) || formatAddress(scope.row.to)}}
                        </span>
                        <router-link v-else-if="isValid(scope.row.to)" :to="`/tx?txHash=${scope.row.txHash}`">
                            {{ `${scope.row.to.length} ${$t('ExplorerLang.unit.providers')}`}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                    <span v-show="Number(scope.row.msgCount) > 1"> --</span>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.signer')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.signer"
                                placement="top"
                                :disabled="!isValid(scope.row.signer)">
                        <span v-if="isValid(scope.row.signer) && address !== scope.row.signer" class="address_link" @click="addressRoute(scope.row.signer)">{{formatAddress(scope.row.signer)}}
                        </span>
                        <span v-else-if="isValid(scope.row.signer) && address === scope.row.signer">{{formatAddress(scope.row.signer)}}
                        </span>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Tools from "../../util/Tools"
    import {TxHelper} from "../../helper/TxHelper";
    import { TX_TYPE,TX_STATUS,ColumnMinWidth,monikerNum,decimals } from '../../constant';
    import { addressRoute,formatMoniker,converCoin } from '@/helper/IritaHelper'
    export default {
        name : "TxList",
        components : {},
        props:{
            txData:{
                type:Array,
                required:true,
            },
            address:{
                type:String,
                default:'a'
            }
        },
        data(){
            return {
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth,
                Tools,
                addressRoute,
                formatMoniker,
                monikerNum,
                amountDecimals: decimals.amount,
                txDataList: []
            }
        },
        watch:{
            txData() {
                this.formatTxData()
            }
        },
        created(){
            this.formatTxData()
        },
        methods : {
            isValid(value){
                return (!value || !value.length || value == '--') ? false : true;
            },
            getDisplayTxType(types=[]){
                let type = types[0] || '';
                if (type && types.length > 1) {
                    type += this.$t('ExplorerLang.unit.ellipsis');
                }
                return type;
            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            async formatTxData() {
                this.txDataList = []
                if(this.txData && this.txData.length) {
                    let fees = []
                    for (const tx of this.txData) {
                        let addrObj = TxHelper.getFromAndToAddressFromMsg((tx.msgs || [])[0]);
                        let from = addrObj.from || '--',
                            to =  addrObj.to || '--';
                        let fromMonikers,toMonikers
                        if((tx.monikers || {}).length) {
                            tx.monikers.map( item => {
                                toMonikers = toMonikers || item[to] || ''
                                fromMonikers = fromMonikers || item[from] || ''
                            })
                        }
                        fees.push(tx.fee && tx.fee.amount && tx.fee.amount.length > 0 ? converCoin(tx.fee.amount[0]) :'--')
                        // const fee = tx.fee && tx.fee.amount && tx.fee.amount.length > 0 ? await converCoin(tx.fee.amount[0]) :'--'
                        this.txDataList.push({
                                txHash : tx.tx_hash,
                                blockHeight : tx.height,
                                txType :(tx.msgs || []).map(item=>item.type),
                                from,
                                fromMonikers,
                                toMonikers,
                                to,
                                signer : tx.signers[0],
                                status : tx.status,
                                msgCount : tx.msgs.length,
                                time :Tools.getDisplayDate(tx.time),
                                // Tx_Fee: fee && fee.amount ? `${Tools.toDecimal(fee.amount,this.amountDecimals)} ${fee.denom.toLocaleUpperCase()}` : '--',
                                Tx_Fee: '',
                        })
                    }
                    if(fees && fees.length > 0) {
                        let fee = await Promise.all(fees);
                        this.txDataList.forEach((item,index) => {
                                this.txDataList[index].Tx_Fee = fee[index] && fee[index].amount ? `${Tools.toDecimal(fee[index].amount,this.amountDecimals)} ${fee[index].denom.toLocaleUpperCase()}` : '--';
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }
    /deep/ .hash_status {
        .cell {
            margin-left: 0.05rem;
        }
    }
    .tx_list_content{
        .tx_transaction_content_hash {
            display: flex;
            .status {
                .status_icon{
                    width:0.13rem;
                    height:0.13rem;
                    margin-right:0.05rem;
                }
            }
        }
        .pagination_content {
            display: flex;
            justify-content: flex-end;
            margin: 0.1rem 0 0.2rem 0;
        }
        /deep/ .cell {
            padding: 0 0.04rem;
        }
    }
</style>

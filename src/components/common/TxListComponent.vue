<template>
    <div class="tx_list_content">
        <el-table :data="formatTxData" :empty-text="$t('ExplorerCN.table.emptyDescription')">
            <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerCN.transactions.txHash')">
                <template slot-scope="scope">
                    <div class="tx_transaction_content_hash">
                        <img class="status_icon"
                                     :src="require(`../../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
                        <el-tooltip :content="scope.row.txHash"
                                    placement="top"
                                    :disabled="!isValid(scope.row.txHash)">
                            <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerCN.transactions.block')">
                <template slot-scope="scope">
                    <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerCN.transactions.from')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.from"
                                placement="top"
                                :disabled="!isValid(scope.row.from)">
                        <router-link v-if="isValid(scope.row.from)" :to="`/address/${scope.row.from}`">
                            {{formatAddress(scope.row.from)}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerCN.transactions.to')">
                <template slot-scope="scope">
                    <el-tooltip :content="String(scope.row.to)"
                                placement="top"
                                :key="Math.random()"
                                :disabled="!isValid(scope.row.to) || Array.isArray(scope.row.to)">
                        <router-link v-if="typeof scope.row.to=='string' && isValid(scope.row.to)" :to="`/address/${scope.row.to}`">
                            {{formatAddress(scope.row.to)}}
                        </router-link>
                        <router-link v-else-if="isValid(scope.row.to)" :to="`/tx?txHash=${scope.row.txHash}`">
                            {{ `${scope.row.to.length} ${$t('ExplorerCN.unit.providers')}`}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerCN.transactions.signer')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.signer"
                                placement="top"
                                :disabled="!isValid(scope.row.signer)">
                        <router-link v-if="isValid(scope.row.signer)" :to="`/address/${scope.row.signer}`">{{formatAddress(scope.row.signer)}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerCN.transactions.timestamp')" prop="time">
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
    import { TX_TYPE,TX_STATUS,ColumnMinWidth } from '../../constant';
    export default {
        name : "TxList",
        components : {},
        props:{
            txData:{
                type:Array,
                required:true,
            },
        },
        data(){
            return {
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth
            }
        },
        computed:{
            formatTxData(){
                let result = this.txData.map((tx)=>{
                    let addrObj = TxHelper.getFromAndToAddressFromMsg((tx.msgs || [])[0]);
                    let from = addrObj.from || '--',
                        to =  addrObj.to || '--';
                    return {
                        txHash : tx.tx_hash,
                        blockHeight : tx.height,
                        txType : tx.type,
                        from,
                        to,
                        signer : tx.signer,
                        status : tx.status,
                        time :Tools.getDisplayDate(tx.time),
                    }
                });
                return result;
            }
        },
        mounted(){
        },
        methods : {
            isValid(value){
                return (!value || !value.length || value == '--') ? false : true;
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
    .tx_list_content{
        .tx_transaction_content_hash{
            display: flex;
            align-items: center;
        }
        .status_icon{
            width:0.13rem;
            height:0.13rem;
            margin-right:0.05rem;
        }
        .pagination_content {
            display: flex;
            justify-content: flex-end;
            margin: 0.1rem 0 0.2rem 0;
        }
    }
</style>

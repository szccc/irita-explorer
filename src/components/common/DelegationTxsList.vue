<template>
  <div class="delegation_txs_list">
    <div class="delegations_txs_table_container">
      <el-table :data="dataList" style="width: 100%" :empty-text="$t('ExplorerLang.table.emptyDescription')">
        <el-table-column prop="Tx_Hash" align="center" :label="$t('ExplorerLang.table.txHash')" :min-width="ColumnMinWidth.txHash">
          <template v-slot:default="{ row }">
            <img class="status_icon" :src="require(`../../assets/${row.Tx_Status == 'Success' ? 'success.png' : 'failed.png'}`)" />
            <el-tooltip :content="`${row.Tx_Hash}`">
              <router-link :to="`/tx?txHash=${row.Tx_Hash}`" :style="{ color: '$theme_c !important' }">{{ formatTxHash(row.Tx_Hash) }} </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Block" :label="$t('ExplorerLang.table.block')" :min-width="ColumnMinWidth.blockHeight">
          <template v-slot:default="{ row }">
            <router-link style="font-family: Arial;" :to="'/block/' + row.Block" :style="{ color: '$theme_c !important' }">{{ row.Block }} </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="From" :label="$t('ExplorerLang.table.from')" :min-width="ColumnMinWidth.address">
          <template v-slot:default="{ row }">
            <span v-if="/^[1-9]\d*$/.test(row.From)" class="skip_route">
              <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.From }} Validators</router-link>
            </span>
            <div class="name_address" v-if="!/^[0-9]\d*$/.test(row.From) && row.From && row.From !== '--'">
              <span class="remove_default_style skip_route" :class="row.From === $route.params.param ? 'no_skip' : ''">
                <el-tooltip :content="`${row.From}`">
                    <span v-if="row.From === $route.params.param">{{ formatMoniker(row.fromMonikers) || formatAddress(row.From) }}</span>
                    <router-link v-else :to="Tools.addressRoute(row.From)" class="link_style">{{ formatMoniker(row.fromMonikers) || formatAddress(row.From) }}</router-link>
                </el-tooltip>
              </span>
            </div>
            <span class="no_skip" v-show="/^[0]\d*$/.test(row.From) || row.From === '--'">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="Amount" :label="$t('ExplorerLang.table.amount')" :min-width="ColumnMinWidth.amount"></el-table-column>
        <el-table-column prop="To" row-class-name="left" align="left" :label="$t('ExplorerLang.table.to')" :min-width="ColumnMinWidth.address">
          <template v-slot:default="{ row }">
            <span v-if="/^[1-9]\d*$/.test(row.To)" class="skip_route">
              <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.To }} Validators</router-link>
            </span>
            <div class="name_address" v-show="!/^[0-9]\d*$/.test(row.To) && row.To && row.To !== '--'">
              <span class="remove_default_style skip_route" :class="row.To === $route.params.param ? 'no_skip' : ''">
                <el-tooltip :content="`${row.To}`">
                    <router-link v-if="!(row.To === $route.params.param)" class="link_style" :to="Tools.addressRoute(row.To)">{{ formatMoniker(row.toMonikers) || formatAddress(row.To) }}</router-link>
                    <span v-else>{{ formatMoniker(row.toMonikers) }}</span>
                </el-tooltip>
              </span>
            </div>
            <span class="no_skip" v-show="/^[0]\d*$/.test(row.To) || row.To === '--'">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="Tx_Type" :label="$t('ExplorerLang.table.txType')" :min-width="ColumnMinWidth.txType">
          <template v-slot:default="{ row }">
            <el-tooltip :content="row.Tx_Type.join(',')" placement="top" :disabled="row.Tx_Type.length <= 1">
              <span>{{ getDisplayTxType(row.Tx_Type) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="MsgsNum" :label="$t('ExplorerLang.table.message')" :min-width="ColumnMinWidth.message"> </el-table-column>
        <el-table-column prop="Tx_Fee" :label="$t('ExplorerLang.table.fee')" :min-width="ColumnMinWidth.fee"></el-table-column>
        <el-table-column prop="Tx_Signer" :label="$t('ExplorerLang.table.signer')" :min-width="ColumnMinWidth.address">
          <template v-slot:default="{ row }">
            <el-tooltip :content="`${row.Tx_Signer}`">
                <router-link :to="Tools.addressRoute(row.Tx_Signer)" class="link_style justify">{{ formatAddress(row.Tx_Signer) }} </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Timestamp" :label="$t('ExplorerLang.table.txTimestamp')" :min-width="ColumnMinWidth.timestamp"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Tools from '@/util/Tools'
import { ColumnMinWidth } from '@/constant'

export default {
  name: 'DelegationTxsList',
  components: {},
  props: {
    dataList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
        ColumnMinWidth,
        Tools
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    formatMoniker(moniker) {
      if (!moniker) {
        return ''
      }
      return Tools.formatString(moniker, 8, '...')
    },
    getDisplayTxType(types = []) {
      let type = types[0] || ''
      if (type && types.length > 1) {
        type += this.$t('ExplorerLang.unit.ellipsis')
      }
      return type
    },
  },
}
</script>

<style lang="scss" scoped>
    .delegation_txs_list {
        .delegations_txs_table_container {
            a {
                color: $t_link_c !important;
            }
            .status_icon {
                width: 0.13rem;
                height: 0.13rem;
                margin-right: 0.05rem;
			      }   
            /deep/ .cell {
              padding: 0;
            }
        }
    }
</style>

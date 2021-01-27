<template>
  <div class="gov_txs_list">
    <div class="gov_txs_table_container">
      <el-table :data="dataList" style="width: 100%" :empty-text="$t('ExplorerLang.table.emptyDescription')">
        <el-table-column class-name="hash_status" align="left" prop="Tx_Hash" :label="$t('ExplorerLang.table.txHash')" :min-width="ColumnMinWidth.txHash">
          <template v-slot:default="{ row }">
            <div class="gov_txs_table_container_status">
              <div class="status">
                <img class="status_icon" :src="require(`../../assets/${row.Tx_Status == 'Success' ? 'success.png' : 'failed.png'}`)" />
              </div>
              <el-tooltip :content="`${row.Tx_Hash}`">
                <div>
                  <router-link :to="`/tx?txHash=${row.Tx_Hash}`" :style="{ color: '$theme_c !important' }">{{ formatTxHash(row.Tx_Hash) }} </router-link>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="Block" :label="$t('ExplorerLang.table.block')" :min-width="ColumnMinWidth.blockHeight">
          <template v-slot:default="{ row }">
            <router-link style="font-family: Arial;" :to="'/block/' + row.Block" :style="{ color: '$theme_c !important' }">{{ row.Block }} </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="proposalType" :label="$t('ExplorerLang.table.proposalType')" :min-width="ColumnMinWidth.proposalType"> </el-table-column>
        <el-table-column prop="proposalId" :label="$t('ExplorerLang.table.proposalID')" :min-width="ColumnMinWidth.proposalID">
          <template v-slot:default="{ row }">
            <router-link :to="`/ProposalsDetail/${row.id}`">{{ row.proposalId }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="proposalTitle" :label="$t('ExplorerLang.table.proposalTitle')" :min-width="ColumnMinWidth.proposalTitle">
          <template v-slot:default="{ row }">
            <router-link :to="`/ProposalsDetail/${row.id}`">{{ row.proposalTitle }}</router-link>
          </template>
        </el-table-column>
        <el-table-column class-name="amount" prop="amount" align="right" :min-width="ColumnMinWidth.amount" :label="$t('ExplorerLang.table.amount')"></el-table-column>
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
            <el-tooltip :disabled="row.Tx_Signer === '--'" :content="`${row.Tx_Signer}`">
              <span @click="addressRoute(row.Tx_Signer)" class="address_link link_style justify">{{ formatAddress(row.Tx_Signer) }} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Timestamp" :label="$t('ExplorerLang.table.txTimestamp')" :width="ColumnMinWidth.timestamp"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Tools from "@/util/Tools";
import { ColumnMinWidth, monikerNum } from "@/constant";
import { addressRoute, formatMoniker } from "@/helper/IritaHelper";
export default {
  name: "GovTxsList",
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
      Tools,
      addressRoute,
      formatMoniker,
      monikerNum,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    formatAddress(address) {
      return Tools.formatValidatorAddress(address);
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
    },
    getDisplayTxType(types = []) {
      let type = types[0] || "";
      if (type && types.length > 1) {
        type += this.$t("ExplorerLang.unit.ellipsis");
      }
      return type;
    },
  },
};
</script>

<style lang="scss" scoped>
.gov_txs_list {
  .gov_txs_table_container {
    a {
      color: $t_link_c !important;
    }
    /deep/ .hash_status {
        .cell {
            margin-left: 0.1rem;
        }
    }
    .gov_txs_table_container_status {
      display: flex;
      .status {
        .status_icon {
          width: 0.13rem;
          height: 0.13rem;
          margin-right: 0.05rem;
        }
      }
    }
    /deep/ .cell {
      padding: 0;
    }
    /deep/ .amount {
      padding-right: 20px;
    }
  }
}
</style>

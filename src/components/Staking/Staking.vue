<template>
  <div class="staking_container">
    <div class="staking_content">
      <div class="staking_title_container">
        <span>{{ $t('ExplorerLang.staking.title') }}</span>
        <span>{{ count }} {{ titleStatus }}</span>
      </div>
      <div class="staking_tab_content">
        <m-tabs class="staking_m_tabs" :data="stakingStatusTitleList" :chose="selectStakingStatus"></m-tabs>
      </div>
      <div class="staking_table_list_content">
        <el-table class="sort_table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="tableData" :default-sort="{ prop: 'votingPower', order: 'descending' }">
          <el-table-column type="index" width="45" label="#"></el-table-column>
          <el-table-column prop="moniker" width="195" :label="$t('ExplorerLang.table.moniker')" sortable :sort-orders="['descending', 'ascending']">
            <template v-slot:default="{ row }">
              <div style="display: flex;align-items: center;position: relative">
                <span style="background:#E0E8FF;width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;display: flex;align-items: center;justify-content: center">{{ row.validatorIconSrc }}</span>
                <img v-if="row.url" style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;position: absolute" :src="row.url ? row.url : ''" />
                <router-link style="margin-left: 0.2rem;" :to="'staking/' + row.operatorAddress" class="link_style">{{ row.moniker }}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operatorAddress" width="128" :label="$t('ExplorerLang.table.operator')">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <router-link :to="'staking/' + row.operatorAddress" class="link_style operator_address_style" style="font-family: Consolas,Menlo;color:#171d44;">{{ formatAddress(row.operatorAddress) }}</router-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="commission" width="129" :sort-method="commissionSort" :label="$t('ExplorerLang.table.commission')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column prop="bondedToken" width="152" :sort-method="bondedTokenSort" :label="$t('ExplorerLang.table.bonded_tokens')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column prop="votingPower" width="137" :sort-method="votingPowerSort" :label="$t('ExplorerLang.table.voting_power')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column prop="uptime" width="92" :sort-method="uptimeSort" :label="$t('ExplorerLang.table.uptime')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column prop="selfBond" width="133" :sort-method="selfBondSort" :label="$t('ExplorerLang.table.self_bonded')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column prop="delegatorNum" width="117" :label="$t('ExplorerLang.table.delegators')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column prop="bondHeight" width="132" :label="$t('ExplorerLang.table.bond_height')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :page-size="1" :total="1" :page="1"></m-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MTabs from '.././common/MTabs'
import MPagination from '.././common/MPagination'
import Tools from '../../util/Tools'
import { CHAINNAME } from '../../constant'
import BigNumber from 'bignumber.js'
export default {
  name: 'Staking',
  components: { MTabs, MPagination },
  props: {},
  data() {
    return {
      count: 0,
      titleStatus: 'Active',
      stakingStatusTitleList: [
        {
          title: this.$t('ExplorerLang.staking.status.active'),
          isActive: true,
          name: 'validator',
        },
        {
          title: this.$t('ExplorerLang.staking.status.candidate'),
          isActive: false,
          name: 'candidate',
        },
        {
          title: this.$t('ExplorerLang.staking.status.jailed'),
          isActive: false,
          name: 'jailed',
        },
      ],
      tableData: [
        // {
        //   moniker: 'Binance Validator',
        //   operator: 'iva1543nj4z07vjqztvu3358fr2z2hcp0qtmceank5',
        //   commission: '0.0200000000',
        //   bonded_tokens: '82790804.5114617762831248380000000000',
        //   voting_power: 0.106807716,
        //   uptime: 0.9999421,
        //   self_bonded: '0.999699999999350389',
        //   delegators: 181,
        //   bond_height: '6932060',
        //   url:'https://s3.amazonaws.com/keybase_processed_uploads/b2445a76e545f7c8cc45835e8a7ab905_360_360.jpg'
        // }
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getValidatorsList('validator')
  },
  mounted() {},
  methods: {
    percentSort(a, b, c) {
      a = Number(a.substring(0, a.length - c))
      b = Number(b.substring(0, b.length - c))
      return a - b
    },
    bigNumberSort(a, b, c) {
      a = a.substring(0, a.length - c).replace(/,/g, '')
      b = b.substring(0, b.length - c).replace(/,/g, '')
      a = new BigNumber(a).toNumber()
      b = new BigNumber(b).toNumber()
      return a - b
    },
    commissionSort(a, b) {
      return this.percentSort(a.commission, b.commission, 2)
    },
    bondedTokenSort(a, b) {
      return this.bigNumberSort(a.bondedToken, b.bondedToken, 5)
    },
    votingPowerSort(a, b) {
      return this.percentSort(a.votingPower, b.votingPower, 1)
    },
    uptimeSort(a, b) {
      return this.percentSort(a.uptime, b.uptime, 1)
    },
    selfBondSort(a, b) {
      return this.bigNumberSort(a.selfBond, b.selfBond, 5)
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    selectStakingStatus(i, v) {
      this.titleStatus = v.title
      this.getValidatorsList(v.name)
    },
    async getValidatorsList(type) {
      try {
        const { data: res } = await axios.get(`https://www.irisplorer.io/api/stake/validators?page=1&size=100&type=${type}&origin=browser`)
        this.count = res && res.Count ? res.Count : 0
        let result = res && res.Data ? res.Data : null
        // console.log(result)
        if (result) {
          this.tableData = result.map(item => {
            let regex = /[^\w\u4e00-\u9fa50-9a-zA-Z]/g
            let replaceMoniker = item.description.moniker.replace(regex, '')
            let validatorIconSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : ''
            return {
              validatorStatus: status,
              moniker: Tools.formatString(item.description.moniker, 15, '...'),
              operatorAddress: item.operator_address,
              commission: `${(item.commission.rate * 100).toFixed(2)} %`,
              bondedToken: `${Tools.formatPriceToFixed(Number(item.tokens), 2)} ${CHAINNAME.toLocaleUpperCase()}`,
              uptime: Tools.FormatUptime(item.uptime),
              votingPower: `${(item.voting_rate * 100).toFixed(4)}%`,
              selfBond: `${Tools.subStrings(Tools.formatPriceToFixed(Number(item.self_bond.match(/\d*(\.\d{0,4})?/)[0])), 2)} ${CHAINNAME.toLocaleUpperCase()}`,
              delegatorNum: item.delegator_num,
              bondHeight: Number(item.bond_height),
              unbondingHeight: item.unbonding_height && Number(item.unbonding_height) > 0 ? Number(item.unbonding_height) : '--',
              unbondingTime: new Date(item.unbonding_time).getTime() > 0 ? Tools.format2UTC(item.unbonding_time) : '--',
              identity: item.description.identity,
              url: item.icons ? item.icons : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg'),
              validatorIconSrc: validatorIconSrc,
            }
          })
        } else {
          this.tableData = []
        }
        // console.log(this.tableData)
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.staking_container {
  .staking_content {
    max-width: 12.6rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    text-align: left;
    .staking_title_container {
      margin: 0.3rem 0 0.1rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
      span {
        margin-right: 0.1rem;
      }
    }
    .staking_tab_content {
      margin-bottom: 0.1rem;
      .staking_m_tabs {
        margin-top: -0.2rem;
      }
    }
    .staking_table_list_content {
      width: 100%;
      /deep/ .sort_table {
        overflow: auto hidden;
        td {
          text-align: right;
        }
        /deep/ .sort-caret.ascending,
        .sort-caret.descending {
          margin-left: 0.09rem;
        }
        .el-table__header-wrapper .el-table__header .el-table_1_column_1 {
          text-align: right;
        }
      }
      /deep/ .el-table .descending .sort-caret.descending {
        border-top-color: $theme_c;
      }
      /deep/ .el-table .ascending .sort-caret.ascending {
        border-bottom-color: $theme_c;
      }
      .pagination_content {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin: 0.05rem 0 0.2rem 0;
      }
    }
  }
}
</style>

<template>
  <div class="native_assets_content">
    <div class="native_asset_list_table_container" v-if="issueToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.issueTokenTxs') }}</div>
      <div class="native_asset_list_table_content">
        <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="issueToken">
          <el-table-column :label="$t('ExplorerLang.table.owner')" prop="owner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.owner" placement="top">
                  <router-link :to="Tools.addressRoute(row.owner)">
                    {{ Tools.formatValidatorAddress(row.owner) }}
                  </router-link>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.symbol')" prop="symbol" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.symbol"> {{ row.symbol }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.initialSupply')" prop="initialSupply" :min-width="ColumnMinWidth.totalSupply"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.mintable')" prop="mintable" :min-width="ColumnMinWidth.mintable"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" prop="fee" :min-width="ColumnMinWidth.fee"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :min-width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="issueTokenTotalPageNum" :page-size="pageSize" :page="issueTokenCurrentPageNum" :page-change="issueTokenPageChange"></m-pagination>
        </div>
      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="editToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.editTokenTxs') }}</div>
      <div class="native_asset_list_table_content">
        <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="editToken">
          <el-table-column :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.owner')" prop="owner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.owner" placement="top">
                  <router-link :to="Tools.addressRoute(row.owner)">
                    {{ Tools.formatValidatorAddress(row.owner) }}
                  </router-link>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" prop="fee" :min-width="ColumnMinWidth.fee"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :min-width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="editTokenTotalPageNum" :page-size="pageSize" :page="editTokenCurrentPageNum" :page-change="editTokenPageChange"></m-pagination>
        </div>
      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="mintToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.mintTokenTxs') }}</div>
      <div class="native_asset_list_table_content">
        <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="mintToken">
          <el-table-column :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.owner')" prop="owner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.owner" placement="top">
                  <router-link :to="Tools.addressRoute(row.owner)">
                    {{ Tools.formatValidatorAddress(row.owner) }}
                  </router-link>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.mintTo')" prop="mintTo" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.mintTo" placement="top">
                  <router-link :to="Tools.addressRoute(row.mintTo)">
                    {{ Tools.formatValidatorAddress(row.mintTo) }}
                  </router-link>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.amount')" prop="amount" :min-width="ColumnMinWidth.fee"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" prop="fee" :min-width="ColumnMinWidth.fee"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :min-width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="mintTokenTotalPageNum" :page-size="pageSize" :page="mintTokenCurrentPageNum" :page-change="mintTokenPageChange"></m-pagination>
        </div>
      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="transferToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.transferOwnerTxs') }}</div>
      <div class="native_asset_list_table_content" >
        <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="transferToken">
          <el-table-column :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.srcOwner')" prop="srcOwner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <el-tooltip popper-class="tooltip" :content="row.srcOwner" placement="top">
                <router-link :to="Tools.addressRoute(row.srcOwner)">
                  {{ Tools.formatValidatorAddress(row.srcOwner) }}
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.dstOwner')" prop="dstOwner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <el-tooltip popper-class="tooltip" :content="row.dstOwner" placement="top">
                <router-link :to="Tools.addressRoute(row.dstOwner)">
                  {{ Tools.formatValidatorAddress(row.dstOwner) }}
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" prop="fee" :min-width="ColumnMinWidth.fee"></el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :min-width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="transferTokenTotalPageNum" :page-size="pageSize" :page="transferTokenCurrentPageNum" :page-change="transferTokenPageChange"></m-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MPagination from '.././common/MPagination'
import Tools from '../../util/Tools'
import { getNativeAssetsTxsApi } from '@/service/api'
import productionConfig from '@/productionConfig.js'
import { ColumnMinWidth, TX_TYPE, decimals } from '@/constant'
import { converCoin, getMainToken } from '../../helper/IritaHelper'
export default {
  name: 'AssetTxsComponent',
  components: { MPagination },
  props: {
    symbol: {
      type:String,
      default:''
    }
  },
  data() {
    return {
      Tools,
      ColumnMinWidth,
      issueToken: [],
      editToken: [],
      mintToken: [],
      transferToken: [],
      issueTokenTotalPageNum: 0,
      editTokenTotalPageNum: 0,
      mintTokenTotalPageNum: 0,
      transferTokenTotalPageNum: 0,
      issueTokenCurrentPageNum: 1,
      editTokenCurrentPageNum: 1,
      mintTokenCurrentPageNum: 1,
      transferTokenCurrentPageNum: 1,
      pageSize: 10,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getIssueToken()
    this.getEditToken()
    this.getMintToken()
    this.getTransferToken()
  },
  methods: {
    async getIssueToken() {
      try {
        let res = await this.getNativeAssets(this.issueTokenCurrentPageNum, this.pageSize, true, TX_TYPE.issue_token,this.symbol)
        this.issueTokenTotalPageNum = res && res.count ? res.count : 0
        let result = res && res.data ? res.data : null
        if (result) {
          this.issueToken = await Promise.all(
            result.map(async item => {
              let issueTokenData = item.msgs && item.msgs[0].msg
              let fee = await converCoin(item.fee && item.fee.amount && item.fee.amount[0])
              return {
                owner: issueTokenData && issueTokenData.owner,
                symbol: issueTokenData && issueTokenData.symbol,
                initialSupply: issueTokenData && Tools.formatNumber(issueTokenData.initial_supply),
                mintable: issueTokenData && Tools.firstWordUpperCase(String(issueTokenData.mintable)),
                block: item.height,
                txHash: item.tx_hash,
                fee: fee ? `${Tools.formatPriceToFixed(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : '--',
                time: Tools.getDisplayDate(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.issueToken = []
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getEditToken() {
      try {
        let res = await this.getNativeAssets(this.issueTokenCurrentPageNum, this.pageSize, true, TX_TYPE.edit_token,this.symbol)
        this.editTokenTotalPageNum = res && res.count ? res.count : 0
        let result = res && res.data ? res.data : null
        if (result) {
          this.editToken = await Promise.all(
            result.map(async item => {
              let editTokenData = item.msgs && item.msgs[0].msg
              let fee = await converCoin(item.fee && item.fee.amount && item.fee.amount[0])
              return {
                owner: editTokenData && editTokenData.owner,
                token: editTokenData && editTokenData.symbol,
                block: item.height,
                txHash: item.tx_hash,
                fee: fee ? `${Tools.formatPriceToFixed(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : '--',
                time: Tools.getDisplayDate(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.editToken = []
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getMintToken() {
      try {
        let res = await this.getNativeAssets(this.issueTokenCurrentPageNum, this.pageSize, true, TX_TYPE.mint_token,this.symbol)
        this.mintTokenTotalPageNum = res && res.count ? res.count : 0
        let result = res && res.data ? res.data : null
        let mainToken = await getMainToken()
        if (result) {
          this.mintToken = await Promise.all(
            result.map(async item => {
              let mintTokenData = item.msgs && item.msgs[0].msg
              let fee = await converCoin(item.fee && item.fee.amount && item.fee.amount[0])
              return {
                owner: mintTokenData && mintTokenData.owner,
                token: mintTokenData && mintTokenData.symbol,
                mintTo: mintTokenData && mintTokenData.to,
                amount: (mintTokenData && Tools.formatPriceToFixed(mintTokenData.amount, decimals.fee)) || '--',
                block: item.height,
                txHash: item.tx_hash,
                fee: fee ? `${Tools.formatPriceToFixed(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : '--',
                time: Tools.getDisplayDate(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.mintToken = []
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getTransferToken() {
      try {
        let res = await this.getNativeAssets(this.issueTokenCurrentPageNum, this.pageSize, true, TX_TYPE.transfer_token_owner,this.symbol)
        this.transferTokenTotalPageNum = res && res.count ? res.count : 0
        let result = res && res.data ? res.data : null
        let mainToken = await getMainToken()
        if (result) {
          this.transferToken = await Promise.all(
            result.map(async item => {
              let transferTokenData = item.msgs && item.msgs[0].msg
              let fee = await converCoin(item.fee && item.fee.amount && item.fee.amount[0])
              return {
                token: transferTokenData && transferTokenData.symbol,
                srcOwner: transferTokenData && transferTokenData.src_owner,
                dstOwner: transferTokenData && transferTokenData.dst_owner,
                block: item.height,
                txHash: item.tx_hash,
                fee: fee ? `${Tools.formatPriceToFixed(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : '--',
                time: Tools.getDisplayDate(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.transferToken = []
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getNativeAssets (pageNum, pageSize, useCount, type, symbol) {
      let res;
      if(!symbol) {
        res = await getNativeAssetsTxsApi(pageNum, pageSize, useCount, type)
      } else {
        res = await getNativeAssetsTxsApi(pageNum, pageSize, useCount, type, symbol)
      }
      return res
    },
    issueTokenPageChange(pageNum) {
      if (this.issueTokenCurrentPageNum == pageNum) {
        return
      }
      this.issueTokenCurrentPageNum = pageNum
      this.getIssueToken()
    },
    editTokenPageChange(pageNum) {
      if (this.editTokenCurrentPageNum == pageNum) {
        return
      }
      this.editTokenCurrentPageNum = pageNum
      this.getEditToken()
    },
    mintTokenPageChange(pageNum) {
      if (this.mintTokenCurrentPageNum == pageNum) {
        return
      }
      this.mintTokenCurrentPageNum = pageNum
      this.getMintToken()
    },
    transferTokenPageChange(pageNum) {
      if (this.transferTokenCurrentPageNum == pageNum) {
        return
      }
      this.transferTokenCurrentPageNum = pageNum
      this.getTransferToken()
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
  .native_assets_content {
    max-width: 12rem;
    margin: 0 auto;
    text-align: left;
    .native_asset_title_container {
      margin: 0.28rem 0 0.1rem 0;
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
    .native_asset_list_table_container {
      .txs_title {
        padding: 0.15rem 0px;
        margin-left: 0.1rem;
      }
      .native_asset_list_table_content {
        width: 100%;
        .status_icon {
          width: 0.13rem;
          height: 0.13rem;
          margin-right: 0.05rem;
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

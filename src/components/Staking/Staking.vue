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
          <el-table-column key="1" align="center" type="index" class="index" :min-width="ColumnMinWidth.No" :label="$t('ExplorerLang.table.number')"></el-table-column>
          <el-table-column key="2" align="left" prop="moniker" show-overflow-tooltip  :min-width="150" :label="$t('ExplorerLang.table.name')" sortable :sort-orders="['descending', 'ascending']">
            <template v-slot:default="{ row }">
              <div style="display: flex;align-items: center;position: relative">
                <span class="avatar" style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;display: flex;align-items: center;justify-content: center">{{ row.validatorIconSrc }}</span>
                <img v-if="row.url" style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;position: absolute" :src="row.url ? row.url : ''" />
                <el-tooltip popper-class="tooltip" :disabled="!row.isTooltip" :content="row.monikerValue" placement="top">
                  <router-link style="margin-left: 0.2rem;" :to="'staking/' + row.operatorAddress" class="link_style">{{ row.moniker }}</router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="3" prop="operatorAddress" align="left" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.operator')">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.operatorAddress" placement="top">
                  <router-link :to="'staking/' + row.operatorAddress" class="link_style operator_address_style">
                    {{ formatAddress(row.operatorAddress) }}
                  </router-link>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column key="4" align="center" prop="commission" :min-width="ColumnMinWidth.commission" :sort-method="commissionSort" :label="$t('ExplorerLang.table.commission')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="5" class-name="bondedToken" align="right" prop="bondedToken" :min-width="ColumnMinWidth.bondedTokens" :sort-method="bondedTokenSort" :label="$t('ExplorerLang.table.bondedTokens')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="6" class-name="votingPower" v-if="titleStatus === 'Active'" align="center" prop="votingPower" :min-width="ColumnMinWidth.votingPower" :sort-method="votingPowerSort" :label="$t('ExplorerLang.table.votingPower')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="7" v-if="titleStatus === 'Active'" align="right" prop="uptime" :min-width="ColumnMinWidth.uptime" :sort-method="uptimeSort" :label="$t('ExplorerLang.table.uptime')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="8" align="right" prop="selfBond" :min-width="150" :sort-method="selfBondSort" :label="$t('ExplorerLang.table.selfBonded')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="9" class-name="delegators" v-if="titleStatus !== 'Jailed'" min-width="ColumnMinWidth.delegators" align="center" prop="delegatorNum" width="117" :label="$t('ExplorerLang.table.delegators')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="10" class-name="bondHeight" align="center" prop="bondHeight" :min-width="ColumnMinWidth.bondHeight" :label="$t('ExplorerLang.table.bondHeight')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column key="11" align="center" v-if="titleStatus !== 'Active'" prop="unbondingHeight" :width="ColumnMinWidth.unbondingHeight" :label="$t('ExplorerLang.table.unbondingHeight')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :page-size="1" :total="1" :page="1"></m-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MTabs from '.././common/MTabs'
import MPagination from '.././common/MPagination'
import Tools from '../../util/Tools'
import BigNumber from 'bignumber.js'
import { getValidatorsListApi } from "@/service/api"
import productionConfig from '@/productionConfig.js'
import { getMainToken,converCoin } from '@/helper/IritaHelper';
import { ColumnMinWidth } from '@/constant'
export default {
  name: 'Staking',
  components: { MTabs, MPagination },
  props: {},
  data() {
    return {
      cutNumber: 8,
      decimalNamber: 2,
      percentum:4,
      ColumnMinWidth,
      count: 0,
      titleStatus: this.$t('ExplorerLang.staking.status.active'),
      stakingStatusTitleList: [
        {
          title: this.$t('ExplorerLang.staking.status.active'),
          isActive: true,
          name: 'active',
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
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getValidatorsList(this.stakingStatusTitleList[0].name)
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
      let mainToken = await getMainToken();
      try{
          let res = await getValidatorsListApi(1,100,true,type)
            res =  {"data": [
            {
                "operator_address": "iva1svannhv2zaxefq83m7treg078udfk37lpjufkw",
                "consensus_pubkey": "icp1zcjduepqlv6f7st4zkqw2t80deevxen43zjscmgx9md4rvjtqucryuq0dtvskw7n6c",
                "jailed": false,
                "status": 3,
                "tokens": "1000000000000",
                "delegator_shares": "1000000000000.000000000000000000",
                "description": {
                    "moniker": "IRISnet-Bianjie"
                },
                "bond_height": "0",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.100000000000000000",
                        "max_rate": "0.200000000000000000",
                        "max_change_rate": "0.010000000000000000"
                    },
                    "update_time": 1603076870
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "100000000"
                },
                "delegator_num": 1,
                "proposer_addr": "489AB90DB6988CFA0E67E75C152FA20C12D41B63",
                "voting_power": 1000000000000,
                "icons": "",
                "voting_rate": 0.9995272735759623
            },
            {
                "operator_address": "iva1httpn7slzvqllw9vn5fz8x5zmkl93d3kwaacpp",
                "consensus_pubkey": "icp1zcjduepqf3mue5fdjna82c0hxu0calt34dnqkdxy690mymz9rhpks2hyu73skm00y8",
                "jailed": false,
                "status": 3,
                "tokens": "10000000",
                "delegator_shares": "10000000.000000000000000000",
                "description": {
                    "moniker": "Nodeasy",
                    "identity": "F7BABF2C95B02A9F",
                    "details": "Nodeasy.com，助你进入Staking时代！"
                },
                "bond_height": "4764",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.100000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603101468
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "10000000"
                },
                "delegator_num": 1,
                "proposer_addr": "55BCFCEDC38200E42C5D913E7A4245DC2039739F",
                "voting_power": 10000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/d8c764c7e286d36525b9e037fdd7aa05_360_360.jpg",
                "voting_rate": 0.000009995272735759622
            },
            {
                "operator_address": "iva1ve5p4xas7ptmp367mkvlka86zszpt93yjx5ge2",
                "consensus_pubkey": "icp1zcjduepqnzkas50uhzeh25yprsuptfwkzkuh836v8dz5wlztlykzwhfjt6es7ud992",
                "jailed": false,
                "status": 3,
                "tokens": "8000000",
                "delegator_shares": "8000000.000000000000000000",
                "description": {
                    "moniker": "ok-1E70794B56DFB583",
                    "identity": "1E70794B56DFB583"
                },
                "bond_height": "4929",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.090000000000000000",
                        "max_rate": "0.110000000000000000",
                        "max_change_rate": "0.100000000000000000"
                    },
                    "update_time": 1603102298
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "8000000"
                },
                "delegator_num": 1,
                "proposer_addr": "C39CA25787B228622235C1A56E194B4EB4B02D81",
                "voting_power": 8000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/ea90fed1ffba5c74211e4bd9c79c6d05_360_360.jpg",
                "voting_rate": 0.000007996218188607699
            },
            {
                "operator_address": "iva1tyd79ynwjwxtvmhxjq3yks9jlfejewv0n8602t",
                "consensus_pubkey": "icp1zcjduepqd2ph9mmyhx5e5uz3j9vwmdq50p6xxrf5p5w8muv23wzkgwwxgjaqc0jcsd",
                "jailed": false,
                "status": 3,
                "tokens": "50000000",
                "delegator_shares": "50000000.000000000000000000",
                "description": {
                    "moniker": "TomShi",
                    "identity": "F1F0BF192D84EAC3"
                },
                "bond_height": "6556",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "1.000000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603110474
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "50000000"
                },
                "delegator_num": 1,
                "proposer_addr": "3CE905C0B87849C06CD90119C2986D9423EF4371",
                "voting_power": 50000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/1718038c86c665895ee7e7e0ace0e505_360_360.jpg",
                "voting_rate": 0.00004997636367879811
            },
            {
                "operator_address": "iva18p5jgdfw6dh0ftwg72ezxj4qfffn6l4jxn2vw4",
                "consensus_pubkey": "icp1zcjduepqf7w8ersmww0zudg2sgylz2grz3cw3rszkw23rgqlyu2r0rdydxwsstmfus",
                "jailed": false,
                "status": 3,
                "tokens": "90000000",
                "delegator_shares": "90000000.000000000000000000",
                "description": {
                    "moniker": "dolphintwo-7A38C8CD6C0FA32A",
                    "identity": "7A38C8CD6C0FA32A",
                    "details": "IRIS To The Moon!!!"
                },
                "bond_height": "17430",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.500000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "0.200000000000000000"
                    },
                    "update_time": 1603165112
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "90000000"
                },
                "delegator_num": 1,
                "proposer_addr": "740A34638BF6603FC6B7F8AE46FD8F4FE6C782E5",
                "voting_power": 90000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/2fa0d167099c079cfd392f5e65385e05_360_360.jpg",
                "voting_rate": 0.0000899574546218366
            },
            {
                "operator_address": "iva10t82jfgxsknp3keeh2xg7lgpl3qykm0lv7hwj8",
                "consensus_pubkey": "icp1zcjduepq3rcupph4dnnveeqcykxmgsuv89g4uvt566xcqt6jhexxq39tx3fqzwr3kc",
                "jailed": false,
                "status": 3,
                "tokens": "10000000",
                "delegator_shares": "10000000.000000000000000000",
                "description": {
                    "moniker": "node-77354B6112254B0C",
                    "identity": "77354B6112254B0C"
                },
                "bond_height": "20655",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "1.000000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603181318
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "10000000"
                },
                "delegator_num": 1,
                "proposer_addr": "DEE53AF4A24FDE34B123EAE47AD83A89067F5162",
                "voting_power": 10000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/d5358105b8194432d86e565d20a1a705_360_360.jpg",
                "voting_rate": 0.000009995272735759622
            },
            {
                "operator_address": "iva1h8q0k2uzm2fdqxghn4l6g0uphamvh5xl44pmuw",
                "consensus_pubkey": "icp1zcjduepq43vamhrgkzz4lx6svdxvu73h42pk7xaeadjxes2r2s9m0mxfdsnsuuy6t8",
                "jailed": false,
                "status": 3,
                "tokens": "90000000",
                "delegator_shares": "90000000.000000000000000000",
                "description": {
                    "moniker": "ATEAM-B9A4E7643FF992",
                    "identity": "0CB9A4E7643FF992"
                },
                "bond_height": "21757",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "1.000000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603186857
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "90000000"
                },
                "delegator_num": 1,
                "proposer_addr": "0CBC9A838ED4AA2AE35903122C79E1F8490076FC",
                "voting_power": 90000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/aa0587c3c52691f11dec30dfe8ca9105_360_360.jpg",
                "voting_rate": 0.0000899574546218366
            },
            {
                "operator_address": "iva1dracl5s6kntg03rtvw6n2w9qwpav288v7p2m38",
                "consensus_pubkey": "icp1zcjduepq6wcd899srlah9yft2kd225wsp8ytaztks43zz5whjz3n7e7r7qtqnflat5",
                "jailed": false,
                "status": 3,
                "tokens": "10000000",
                "delegator_shares": "10000000.000000000000000000",
                "description": {
                    "moniker": "bifrost-E81A00BBE8FF6A70",
                    "identity": "E81A00BBE8FF6A70"
                },
                "bond_height": "26023",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.001000000000000000",
                        "max_rate": "0.100000000000000000",
                        "max_change_rate": "0.100000000000000000"
                    },
                    "update_time": 1603208300
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "10000000"
                },
                "delegator_num": 1,
                "proposer_addr": "B659260E4FEB93C015EEDDC70D35ECF88861B023",
                "voting_power": 10000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/7ae5c29e305b3d273c55233952498f05_360_360.jpg",
                "voting_rate": 0.000009995272735759622
            },
            {
                "operator_address": "iva1q8uaq48plh7xnzskfq4verlrvu5nqhhqqastap",
                "consensus_pubkey": "icp1zcjduepqetghhf7v7twk936xpgn8ggut2vjc3jec87p8666umgcafzw03j2s48mzxr",
                "jailed": false,
                "status": 3,
                "tokens": "10000000",
                "delegator_shares": "10000000.000000000000000000",
                "description": {
                    "moniker": "z3ustb-4DF28CA60DE9BEA8"
                },
                "bond_height": "36686",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.100000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "0.100000000000000000"
                    },
                    "update_time": 1603261901
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "10000000"
                },
                "delegator_num": 1,
                "proposer_addr": "58510F76AF799E9A4A3149B244A13211FE49A5B4",
                "voting_power": 10000000,
                "icons": "",
                "voting_rate": 0.000009995272735759622
            },
            {
                "operator_address": "iva1zq3gx0mvm36nkplcvka28sumap87evklqx75kj",
                "consensus_pubkey": "icp1zcjduepqpcmhxhprquxsjupkjxe8pm6jlt7v7pl0gsh86s57kdg5r4tf593q6qztwn",
                "jailed": false,
                "status": 3,
                "tokens": "50000000",
                "delegator_shares": "50000000.000000000000000000",
                "description": {
                    "moniker": "meeos-B9AD1A3415F01718C95D2C7594B80B7414B7104B"
                },
                "bond_height": "37336",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.100000000000000000",
                        "max_rate": "0.200000000000000000",
                        "max_change_rate": "0.100000000000000000"
                    },
                    "update_time": 1603265169
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "50000000"
                },
                "delegator_num": 1,
                "proposer_addr": "ABE225F744D20EFCDEB42E25F5E5DBA54BD986C2",
                "voting_power": 50000000,
                "icons": "",
                "voting_rate": 0.00004997636367879811
            },
            {
                "operator_address": "iva139p3z32tmnvj06e9xxag2f3xnnrluqldfwsh2r",
                "consensus_pubkey": "icp1zcjduepqkez2dr962qazzf8sxxsa0p4zdya0yuqk8rmxe6vj6sujppu05hzspx53zj",
                "jailed": false,
                "status": 3,
                "tokens": "10000000",
                "delegator_shares": "10000000.000000000000000000",
                "description": {
                    "moniker": "wukong-9A26C5A2EE8EAFD2",
                    "identity": "9A26C5A2EE8EAFD2"
                },
                "bond_height": "40594",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.100000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603281550
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "10000000"
                },
                "delegator_num": 1,
                "proposer_addr": "FBD5682243589D945BF1AAA93E7AB48F1F561195",
                "voting_power": 10000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/b08bb1b609db7ca7c80a09e04f082505_360_360.jpg",
                "voting_rate": 0.000009995272735759622
            },
            {
                "operator_address": "iva1axd4cssyqwd2dhp7zes00405u4efr2qanhnu5z",
                "consensus_pubkey": "icp1zcjduepqd7kfh4hs7r8tylsrjygj74w7vmmrs693qg2k8dds9fmk60ujneuswtq5qr",
                "jailed": false,
                "status": 3,
                "tokens": "80000000",
                "delegator_shares": "80000000.000000000000000000",
                "description": {
                    "moniker": "sensen-76D5AA9D2A33D194",
                    "identity": "76D5AA9D2A33D194"
                },
                "bond_height": "43023",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "0.100000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603293765
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "80000000"
                },
                "delegator_num": 1,
                "proposer_addr": "2CF32B0397B2C334839ED1EDE9A244B5BDE198B9",
                "voting_power": 80000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/c6162f5ca96086eb35b2996f714ed905_360_360.jpg",
                "voting_rate": 0.00007996218188607698
            },
            {
                "operator_address": "iva19h3ktqlg9fe3yt9hnza5jx9v67lggd0xhj3r7m",
                "consensus_pubkey": "icp1zcjduepqtykafqhz56ruuvs928mn7xeflqzt402c0yuez8w5wckzrf3fcmuq2r7qqy",
                "jailed": false,
                "status": 3,
                "tokens": "50000000",
                "delegator_shares": "50000000.000000000000000000",
                "description": {
                    "moniker": "djspys1-9377207847D7AA01",
                    "identity": "9377207847D7AA01"
                },
                "bond_height": "50563",
                "unbonding_height": "",
                "commission": {
                    "commission_rates": {
                        "rate": "1.000000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "0.100000000000000000"
                    },
                    "update_time": 1603331688
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "50000000"
                },
                "delegator_num": 1,
                "proposer_addr": "5B83D3CEEDDEA4364153688F80D66FC476A14DC9",
                "voting_power": 50000000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/6ce560e30e67ab271ae342c268ce5a05_360_360.jpg",
                "voting_rate": 0.00004997636367879811
            },
            {
                "operator_address": "iva16yl8d9lt7lk8rxx9mwyt6z6nft2cun2yasrk9j",
                "consensus_pubkey": "icp1zcjduepqwnvvshqqaenc59p8x93g30px9h2wx6rkruc5xffcsut2332htf4s6fl2t3",
                "jailed": false,
                "status": 3,
                "tokens": "4950000",
                "delegator_shares": "5000000.000000000000000000",
                "description": {
                    "moniker": "liangcheng-DBF3F5B2CA263BF2",
                    "identity": "DBF3F5B2CA263BF2"
                },
                "bond_height": "51650",
                "unbonding_height": "52270",
                "commission": {
                    "commission_rates": {
                        "rate": "0.500000000000000000",
                        "max_rate": "1.000000000000000000",
                        "max_change_rate": "1.000000000000000000"
                    },
                    "update_time": 1603337453
                },
                "uptime": 1,
                "self_bond": {
                    "denom": "ubif",
                    "amount": "4950000"
                },
                "delegator_num": 1,
                "proposer_addr": "9EAD3EF8DFCE86B9AEF40500A083F8C81D9A17E3",
                "voting_power": 4950000,
                "icons": "https://s3.amazonaws.com/keybase_processed_uploads/8cffb93490dfbd61b869a0f61b3b0005_360_360.jpg",
                "voting_rate": 0.000004947660004201013
            }
        ],
        "pageNum": 1,
        "pageSize": 100,
        "count": 14
    }
          this.count = res && res.count ? res.count : 0
          let result = res && res.data ? res.data : null
          if (result) {
            this.tableData =  
              await Promise.all(result.map( async item => {
                let regex = /[^\w\u4e00-\u9fa50-9a-zA-Z]/g
                let replaceMoniker = item.description.moniker.replace(regex, '')
                let validatorIconSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : ''
                let selfBond = await converCoin(item.self_bond)
                let bondedToken = await converCoin({
                  amount: item.tokens,
                  denom: mainToken.min_unit
                })
                return {
                  validatorStatus: status,
                  isTooltip: item.description.moniker.length > this.cutNumber,
                  monikerValue: item.description.moniker,
                  moniker: Tools.formatString(item.description.moniker, this.cutNumber, '...'),
                  operatorAddress: item.operator_address,
                  commission: `${(item.commission.commission_rates.rate * 100).toFixed(this.decimalNamber)} %`,
                  bondedToken: `${Tools.subStrings(bondedToken.amount, this.decimalNamber)} ${bondedToken.denom.toLocaleUpperCase()}`,
                  uptime: Tools.FormatUptime(item.uptime),
                  votingPower: `${(item.voting_rate * 100).toFixed(this.percentum)}%`,
                  selfBond: `${Tools.subStrings(selfBond.amount, this.decimalNamber)} ${selfBond.denom.toLocaleUpperCase()}`,
                  delegatorNum: item.delegator_num,
                  bondHeight: Number(item.bond_height),
                  unbondingHeight: Number(item.unbonding_height),
                  // unbondingTime: new Date(item.unbonding_time).getTime() > 0 ? Tools.format2UTC(item.unbonding_time) : '--',
                  // identity: item.description.identity,
                  url: item.icons ? item.icons : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg'),
                  validatorIconSrc: validatorIconSrc,
                }
              })
            )
          } else {
            this.tableData = []
          }
			}catch(err){
					console.error(err);
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
    max-width: 12rem;
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
      
      .avatar {
        background: $bg_avatar;
      }

      /deep/ .cell {
        padding: 0;
      }
      /deep/ .delegators .cell {
        min-width: 1.21rem;
        padding-right: 0.05rem;
      }

      /deep/ .votingPower .cell {
        min-width: 1.30rem;
      }
      /deep/ .bondHeight .cell {
        padding-right: 0.07rem;
      }
      /deep/ .sort_table {
        overflow: auto hidden;
        .sort-caret.ascending,
        .sort-caret.descending {
          margin-left: 0.05rem;
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

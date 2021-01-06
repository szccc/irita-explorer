<template>
  <div class="proposals_list_page_wrap">
    <div class="proposals_list_content">
      <div class="proposals_title_container">
        <span>{{ $t('ExplorerLang.gov.proposalsTitle') }}</span>
        <span>{{ count }} {{ $t('ExplorerLang.gov.proposals') }}</span>
      </div>
      <div class="graph_containers">
        <div class="graph_container">
          <!-- 投票期提案 -->
          <!-- <div v-for="v in votingPeriodDatas" :key="v.proposal_id">
            <m-proposals-echart :data="v" v-if="v"></m-proposals-echart>
          </div> -->
          <!-- 质押期提案 -->
          <div v-for="v in depositPeriodDatas" :key="v.proposal_id">
            <m-proposals-card :data="v" v-if="v"></m-proposals-card>
          </div>
        </div>
      </div>
      <div class="proposals_list">
        <div class="proposals_icon">
          <div class="icon_list">
            <div>
              <i style="margin-left: 0;"></i>
              <span>{{ $t('ExplorerLang.gov.proposalOption.yes') }}</span>
            </div>
            <div>
              <i style="background-color: #CCDCFF;"></i>
              <span>{{ $t('ExplorerLang.gov.proposalOption.abstain') }}</span>
            </div>
            <div>
              <i style="background-color: #FFCF65;"></i>
              <span>{{ $t('ExplorerLang.gov.proposalOption.no') }}</span>
            </div>
            <div>
              <i style="background-color: #FE8A8A;"></i>
              <span>{{ $t('ExplorerLang.gov.proposalOption.noWithVeto') }}</span>
            </div>
          </div>
        </div>
        <div class="proposals_list_table_content">
          <el-table class="proposals_table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="tableData">
            <el-table-column prop="id" :min-width="ColumnMinWidth.proposalID" :label="$t('ExplorerLang.table.proposalId')">
              <template v-slot:default="{ row }">
                <router-link :to="`/ProposalsDetail/${row.id}`">{{ row.id }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="title" :min-width="ColumnMinWidth.proposalTitle" :label="$t('ExplorerLang.table.title')">
              <template v-slot:default="{ row }">
                <router-link :to="`/ProposalsDetail/${row.id}`">{{ row.title }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="type" :min-width="ColumnMinWidth.proposalType" :label="$t('ExplorerLang.table.type')"></el-table-column>
            <el-table-column prop="status" :width="ColumnMinWidth.proposalStatus" :label="$t('ExplorerLang.table.status')">
              <template v-slot:default="{ row }">
                <img class="status_icon" v-if="row.status === proposalStatus.passed" src="../../assets/pass.png" />
                <img class="status_icon" v-if="row.status === proposalStatus.rejected" src="../../assets/rejected.png" />
                <img class="status_icon" v-if="row.status === proposalStatus.votingPeriod" src="../../assets/voting_period.png" />
                <img class="status_icon" v-if="row.status === proposalStatus.depositPeriod" src="../../assets/deposit_period.png" />
                <span>{{ row.status }}</span>
              </template>
            </el-table-column>
            <el-table-column :width="ColumnMinWidth.strip">
              <template v-slot:default="{ row }">
                <div class="votes_per_content">
                  <el-tooltip :content="`Yes: ${formatNum(row.finalVotes.yes)} %`" placement="top" effect="dark">
                    <div class="votes_per" :style="{ width: `${row.finalVotes.yes}%` }"></div>
                  </el-tooltip>
                  <el-tooltip :content="`Abstain: ${formatNum(row.finalVotes.abstain)} %`" placement="top" effect="dark">
                    <div class="votes_per" :style="{ backgroundColor: '#CCDCFF', width: `${row.finalVotes.abstain}%` }"></div>
                  </el-tooltip>
                  <el-tooltip :content="`No: ${formatNum(row.finalVotes.no)} %`" placement="top" effect="dark">
                    <div class="votes_per" :style="{ backgroundColor: '#FFCF65', width: `${row.finalVotes.no}%` }"></div>
                  </el-tooltip>
                  <el-tooltip :content="`NoWithVeto: ${formatNum(row.finalVotes.no_with_veto)} %`" placement="top" effect="dark">
                    <div class="votes_per" :style="{ backgroundColor: '#FE8A8A', width: `${row.finalVotes.no_with_veto}%` }"></div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="submitTime" :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.submitTime')"></el-table-column>
            <el-table-column prop="depositEndTime" :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.depositEndTime')"></el-table-column>
            <el-table-column prop="votingEndTime" :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.votingEndTime')"></el-table-column>
          </el-table>
          <div class="pagination_content">
            <m-pagination :page-size="pageSize" :total="count" :page="pageNum" :page-change="pageChange"></m-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MPagination from '.././common/MPagination'
import { ColumnMinWidth } from '@/constant'
import { getProposalsListApi } from '@/service/api.js'
import Tools from '../../util/Tools'
import { converCoin, getMainToken } from '../../helper/IritaHelper'
import MProposalsCard from '../common/MProposalsCard'
import { proposalStatus } from '../../constant'
export default {
  name: '',
  components: {
    MPagination,
    MProposalsCard,
  },
  props: {},
  data() {
    return {
      ColumnMinWidth,
      proposalStatus,
      count: 0,
      pageNum: 1,
      pageSize: 30,
      tableData: [],
      proposalTitleNum: 20,
      depositPeriodDatas: [],
      votingPeriodDatas: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getProposalsList()
  },
  mounted() {},
  methods: {
    async getProposalsList() {
      try {
        let res = await getProposalsListApi(this.pageNum, this.pageSize, true)
        if (res && res.data && res.data.length > 0) {
          this.count = res.count
          this.tableData = res.data.map(proposal => {
            let id = proposal.id
            let title = proposal.content && Tools.formatString(proposal.content.title, this.proposalTitleNum, '...')
            let type = proposal.content && proposal.content.type
            let status = proposal.status
            let submitTime = proposal.submit_time ? Tools.getDisplayDate(proposal.submit_time) : '--'
            let depositEndTime = proposal.deposit_end_time ? Tools.getDisplayDate(proposal.deposit_end_time) : '--'
            let votingEndTime = proposal.voting_end_time ? Tools.getDisplayDate(proposal.voting_end_time) : '--'
            let finalVotes = {}
            let finalTotalVotes = 0
            if (status === 'VotingPeriod') {
              let currentTallyResult = proposal.current_tally_result
              if (currentTallyResult) {
                finalTotalVotes = currentTallyResult.total_voting_power
                finalVotes.yes = (currentTallyResult.yes / finalTotalVotes) * 100
                finalVotes.no = (currentTallyResult.no / finalTotalVotes) * 100
                finalVotes.abstain = (currentTallyResult.abstain / finalTotalVotes) * 100
                finalVotes.no_with_veto = (currentTallyResult.no_with_veto / finalTotalVotes) * 100
              }
            } else {
              finalVotes = Object.keys(proposal.final_tally_result).length > 0 ? proposal.final_tally_result : finalVotes
              for (let k in proposal.final_tally_result) {
                finalTotalVotes += Number(proposal.final_tally_result[k])
              }
              for (let k in finalVotes) {
                finalVotes[k] = (Number(finalVotes[k]) / finalTotalVotes) * 100
              }
            }
            return {
              id,
              title,
              type,
              status: status,
              submitTime,
              depositEndTime,
              votingEndTime,
              finalTotalVotes,
              finalVotes,
            }
          })
          let depositPeriodDatas = res.data.filter(v => v.status === 'DepositPeriod')
          let mainToken = await getMainToken()
          for (const v of depositPeriodDatas) {
            v.proposal_id = v.id
            v.title = v.content && v.content.title
            v.type = v.content && v.content.type
            v.min_deposit_number = Number(v.min_deposit)
            let n = await converCoin({
              denom: mainToken.min_unit,
              amount: v.min_deposit_number,
            })
            v.min_deposit_format = `${n.amount} ${n.denom.toUpperCase()}`
            if (v.initial_deposit && v.initial_deposit[0] && v.initial_deposit[0].amount) {
              let initial_deposit = v.initial_deposit[0]
              v.initial_deposit_number = Number(initial_deposit.amount)
              let n = await converCoin(initial_deposit)
              v.initial_deposit_format = `${n.amount} ${n.denom.toUpperCase()}`
            }
            if (v.total_deposit && v.total_deposit[0] && v.total_deposit[0].amount) {
              let total_deposit = v.total_deposit[0]
              v.total_deposit_number = Number(total_deposit.amount)
              let n = await converCoin(total_deposit)
              v.total_deposit_format = `${n.amount} ${n.denom.toUpperCase()}`
            }
            v.initial_deposit_number_per = this.isNumber(v.initial_deposit_number) && this.isNumber(v.min_deposit_number) ? this.forLimitNumer(v.initial_deposit_number / v.min_deposit_number) * 100 + '%' : 0
            v.total_deposit_number_per = this.isNumber(v.total_deposit_number) && this.isNumber(v.min_deposit_number) ? this.forLimitNumer(v.total_deposit_number / v.min_deposit_number) * 100 + '%' : 0
          }
          this.depositPeriodDatas = depositPeriodDatas.sort((a, b) => {
            return b.proposal_id - a.proposal_id
          })
          // let votingPeriodDatas = res.data.filter(v => v.status === 'VotingPeriod')
          // this.votingPeriodDatas = votingPeriodDatas.map(item => {
          //   let o = {}
          //   o.proposal_id = item.id
          //   o.title = item.content &&  item.content.title
          //   // o.level = item.level && item.level.name
          //   o.type = item.content &&  item.content.type
          //   o.status = item.status
          //   o.votingEndTime = item.voting_end_time
          //   let all = item.current_tally_result && item.current_tally_result.system_voting_power
          //   let yesArr = item.tally_details.filter(v => v.vote === 'yes')
          //   let yes = yesArr.reduce((init, v) => {
          //     return v.voting_power + init
          //   }, 0)
          //   let noArr = item.tally_details.filter(v => v.vote === 'no')
          //   let no = noArr.reduce((init, v) => {
          //     return v.voting_power + init
          //   }, 0)
          //   let abstainArr = item.tally_details.filter(v => v.vote === 'abstain')
          //   let abstain = abstainArr.reduce((init, v) => {
          //     return v.voting_power + init
          //   }, 0)
          //   let noWithVetoArr = item.tally_details.filter(v => v.vote === 'no_with_veto')
          //   let noWithVeto = noWithVetoArr.reduce((init, v) => {
          //     return v.voting_power + init
          //   }, 0)
          //   let votes = yes + no + abstain + noWithVeto
          //   o.participationNum = item.level && item.level.gov_param && item.level.gov_param.participation && this.formatNumber(item.level.gov_param.participation)
          //   o.passThresholdNum = item.level && item.level.gov_param && item.level.gov_param.pass_threshold && this.formatNumber(item.level.gov_param.pass_threshold)
          //   o.vetoThresholdNum = item.level && item.level.gov_param && item.level.gov_param.veto_threshold && this.formatNumber(item.level.gov_param.veto_threshold)
          //   o.participation = all ? (votes / all) * 100 : 0
          //   o.passThreshold = votes ? (yes / votes) * 100 : 0
          //   o.vetoThreshold = votes ? (noWithVeto / votes) * 100 : 0
          //   let nonparticipantPer = Tools.formatDecimalNumberToFixedNumber(((all - votes) / all) * 100)
          //   let data = [
          //     {
          //       name: 'Participant',
          //       value: votes,
          //       perData: Tools.formatDecimalNumberToFixedNumber((votes / all) * 100),
          //       itemStyle: {
          //         // color: '#3598DB',
          //         borderColor: '#ECEFFF',
          //         borderWidth: 0,
          //       },
          //       children: [
          //         {
          //           name: 'Yes',
          //           value: yes,
          //           perData: Tools.formatDecimalNumberToFixedNumber((yes / votes) * 100),
          //           itemStyle: {
          //             // color: '#45B4FF',
          //             borderColor: '#ECEFFF',
          //             borderWidth: 0,
          //           },
          //           // children: this.formatGrahpChildren(yesArr, {h: [205, 204], s: [100, 100], l: [79, 35]})
          //         },
          //         {
          //           name: 'Abstain',
          //           value: abstain,
          //           perData: Tools.formatDecimalNumberToFixedNumber((abstain / votes) * 100),
          //           itemStyle: {
          //             color: '#CCDCFF',
          //             borderColor: '#ECEFFF',
          //             borderWidth: 0,
          //           },
          //           children: this.formatGrahpChildren(abstainArr, { h: [222, 221], s: [100, 44], l: [86, 58] }),
          //         },
          //         {
          //           name: 'No',
          //           value: no,
          //           perData: Tools.formatDecimalNumberToFixedNumber((no / votes) * 100),
          //           itemStyle: {
          //             color: '#FFCF65',
          //             borderColor: '#ECEFFF',
          //             borderWidth: 0,
          //           },
          //           children: this.formatGrahpChildren(noArr, { h: [36, 36], s: [100, 100], l: [77, 48] }),
          //         },
          //         {
          //           name: 'NoWithVeto',
          //           value: noWithVeto,
          //           perData: Tools.formatDecimalNumberToFixedNumber((noWithVeto / votes) * 100),
          //           itemStyle: {
          //             color: '#FE8A8A',
          //             borderColor: '#ECEFFF',
          //             borderWidth: 0,
          //           },
          //           children: this.formatGrahpChildren(noWithVetoArr, { h: [21, 21], s: [100, 100], l: [79, 50] }),
          //         },
          //       ],
          //     },
          //     {
          //       name: 'Nonparticipant',
          //       value: all - votes,
          //       perData: nonparticipantPer,
          //       nodeClick: false,
          //       itemStyle: {
          //         color: '#E5E9FB',
          //         borderColor: '#E5E9FB',
          //         borderWidth: 0,
          //       },
          //       label: {
          //         color: '#51A9FF',
          //         textBorderWidth: 0,
          //         fontWeight: 600,
          //       },
          //       children: [
          //         {
          //           name: '',
          //           tipName: 'Nonparticipant',
          //           value: all - votes,
          //           perData: nonparticipantPer,
          //           nodeClick: false,
          //           itemStyle: {
          //             color: '#E5E9FB',
          //             borderColor: '#E5E9FB',
          //             borderWidth: 0,
          //           },
          //           children: [
          //             {
          //               name: '',
          //               tipName: 'Nonparticipant',
          //               value: all - votes,
          //               perData: nonparticipantPer,
          //               nodeClick: false,
          //               itemStyle: {
          //                 color: '#E5E9FB',
          //                 borderColor: '#E5E9FB',
          //                 borderWidth: 0,
          //               },
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   ]
          //   if (this.$store.state.currentSkinStyle === Constant.CHAINID.IRISHUB) {
          //     data[0].itemStyle.color = skinStyle.skinStyle.MAINNETBGCOLOR
          //     data[0].children[0].itemStyle.color = '#4371FF'
          //     data[0].children[0].children = this.formatGrahpChildren(yesArr, { h: [223, 222], s: [100, 100], l: [75, 35] })
          //   } else if (this.$store.state.currentSkinStyle === Constant.CHAINID.FUXI) {
          //     data[0].children[0].itemStyle.color = '#004EAA'
          //     data[0].itemStyle.color = skinStyle.skinStyle.TESTNETBGCOLOR
          //     data[0].children[0].children = this.formatGrahpChildren(yesArr, { h: [213, 212], s: [100, 100], l: [75, 35] })
          //   } else if (this.$store.state.currentSkinStyle === Constant.CHAINID.NYANCAT) {
          //     data[0].children[0].itemStyle.color = '#06A79A'
          //     data[0].itemStyle.color = skinStyle.skinStyle.NYANCATTESTNETBGCOLOR
          //     data[0].children[0].children = this.formatGrahpChildren(yesArr, { h: [175, 174], s: [100, 100], l: [75, 35] })
          //   } else {
          //     data[0].children[0].itemStyle.color = '#008CEA'
          //     data[0].itemStyle.color = skinStyle.skinStyle.DEFAULTBGCOLOR
          //     data[0].children[0].children = this.formatGrahpChildren(yesArr, { h: [196, 195], s: [100, 100], l: [75, 35] })
          //   }
          //   o.data = data
          //   return o
          // })
          // this.votingPeriodDatas = this.votingPeriodDatas.sort((a, b) => {
          //   return b.proposal_id - a.proposal_id
          // })
        }
      } catch (e) {
        console.error(e)
      }
    },
    isNumber(n) {
      return typeof n === 'number'
    },
    forLimitNumer(number) {
      if (typeof number === 'number') {
        return Math.max(Math.min(number, 1), 0)
      }
    },
    formatNum(num) {
      return Tools.formatPerNumber(num)
    },
    pageChange(pageNum) {
      if (this.pageNum == pageNum) {
        return
      }
      this.pageNum = pageNum
      this.getProposalsList()
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.proposals_list_page_wrap {
  .proposals_list_content {
    max-width: 12rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    text-align: left;
    .proposals_title_container {
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
    .graph_containers {
      .graph_container {
      }
    }
    .proposals_list {
      .proposals_icon {
        display: flex;
        justify-content: flex-end;
        .icon_list {
          display: flex;
          height: 0.7rem;
          padding: 0.04rem 0;
          div {
            font-size: $s14;
            color: $t_second_c;
            display: flex;
            align-items: center;
            i {
              width: 0.12rem;
              height: 0.12rem;
              border-radius: 0.02rem;
              display: inline-block;
              margin-left: 0.5rem;
              background-color: $theme_c;
              vertical-align: middle;
            }
            img {
              width: 0.14rem;
              height: 0.14rem;
              margin-left: 0.5rem;
              vertical-align: middle;
            }
            span {
              margin-left: 0.1rem;
              vertical-align: middle;
            }
          }
        }
      }
      .proposals_list_table_content {
        .proposals_table {
          .status_icon {
            width: 0.14rem;
            margin: 0.08rem 0;
            vertical-align: middle;
            margin-right: 0.1rem;
          }
          .votes_per_content {
            width: 1.02rem;
            height: 0.1rem;
            display: flex;
            .votes_per:nth-of-type(1) {
              background: $theme_c;
            }
          }
        }
        .pagination_content {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          margin: 0.1rem 0 0.2rem 0;
        }
      }
    }
  }
}
</style>

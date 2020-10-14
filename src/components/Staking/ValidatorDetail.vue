<template>
	<div class="">
		<div class="vaildtor_detail_container">
			<div class="vaildtor_detail_content">
				<div class="vaildtor_detail_title_container">
					<span>{{ $t('ExplorerLang.validatorDetail.title') }}</span>
				</div>
				<validator-information :validationInformation="validationInformation"
				                       :validatorStatus="validatorStatus"></validator-information>
				<validator-commission-information
						:validationCommissionInfo="validationInformation"></validator-commission-information>
				<div class="delegations_wrap">
					<div class="delegations_container">
						<!-- Delegations -->
						<div class="one_table_container">
							<p class="validator_information_content_title">{{
								$t('ExplorerLang.validatorDetail.delegationsTitle') }}</p>
							<div class="delegations_table_container">
								<el-table :data="delegations.items" style="width: 100%"
								          :empty-text="$t('ExplorerLang.table.emptyDescription')">
									<el-table-column prop="address" :label="$t('ExplorerLang.table.address')"
									                 width="130">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<router-link style="font-family: Consolas,Menlo;"
												             :to="'/address/' + row.address"
												             :style="{ color: '$theme_c !important' }">{{
													formatAddress(row.address) }}
												</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 align="right" min-width="175"></el-table-column>
									<el-table-column prop="shares" :label="$t('ExplorerLang.table.shares')" align="left"
									                 min-width="213"></el-table-column>
									<!-- 待处理 -->
									<!-- <el-table-column prop="block" :label="$t('ExplorerLang.table.block')" width="110">
									  <template v-slot:default="{ row }">
										<router-link style="font-family: Consolas,Menlo;" :to="'/block/' + row.block" :style="{ color: '$theme_c !important' }">{{ row.block }}</router-link>
									  </template>
									</el-table-column> -->
								</el-table>
							</div>
							<m-pagination v-if="delegations.total > pageSize" :page-size="pageSize"
							              :total="delegations.total"
							              :page-change="pageChange('getDelegations')"></m-pagination>
						</div>
						<!-- Unbonding Delegations -->
						<div class="second_table_container">
							<p class="validator_information_content_title">{{
								$t('ExplorerLang.validatorDetail.unbondingDelegationsTitle') }}</p>
							<div class="delegations_table_container">
								<el-table :data="unbondingDelegations.items" style="width: 100%"
								          :empty-text="$t('ExplorerLang.table.emptyDescription')">
									<el-table-column prop="address" :label="$t('ExplorerLang.table.address')"
									                 width="130">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<router-link style="font-family: Consolas,Menlo;"
												             :to="'/address/' + row.address"
												             :style="{ color: '$theme_c !important' }">{{
													formatAddress(row.address) }}
												</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 align="right" min-width="180"></el-table-column>
									<el-table-column prop="block" :label="$t('ExplorerLang.table.block')" align="left"
									                 min-width="118">
										<template v-slot:default="{ row }">
											<router-link style="font-family: Consolas,Menlo;"
											             :to="'/block/' + row.block"
											             :style="{ color: '$theme_c !important' }">{{ row.block }}
											</router-link>
										</template>
									</el-table-column>
									<el-table-column prop="end_time" :label="$t('ExplorerLang.table.endTime')"
									                 width="200"></el-table-column>
								</el-table>
							</div>
							<m-pagination v-if="unbondingDelegations.total > pageSize" :page-size="pageSize"
							              :total="unbondingDelegations.total"
							              :page-change="pageChange('getUnbondingDelegations')"></m-pagination>
						</div>
					</div>
				</div>
				<!-- Delegation Txs -->
				<div class="delegations_txs_wrap">
					<div class="delegations_txs_container">
						<p class="validator_information_content_title">{{
							$t('ExplorerLang.validatorDetail.delegationsTxsTitle') }}</p>
						<div class="delegations_txs_table_container">
							<el-table :data="delegationTxs.items" style="width: 100%"
							          :empty-text="$t('ExplorerLang.table.emptyDescription')">
								<el-table-column prop="Tx_Hash" :label="$t('ExplorerLang.table.txHash')" width="110">
									<template v-slot:default="{ row }">
										<img class="status_icon"
                                     		:src="require(`../../assets/${row.Tx_Status=='Success' ? 'success.png':'failed.png'}`)"/>
										<el-tooltip :content="`${row.Tx_Hash}`">
											<router-link 
											             :to="`/tx?txHash=${row.Tx_Hash}`"
											             :style="{ color: '$theme_c !important' }">{{
												formatTxHash(row.Tx_Hash) }}
											</router-link>
										</el-tooltip>
									</template>
								</el-table-column>
								<el-table-column prop="Block" :label="$t('ExplorerLang.table.block')" width="76">
									<template v-slot:default="{ row }">
										<router-link style="font-family: Consolas,Menlo;" :to="'/block/' + row.Block"
										             :style="{ color: '$theme_c !important' }">{{ row.Block }}
										</router-link>
									</template>
								</el-table-column>
								<el-table-column prop="From" :label="$t('ExplorerLang.table.from')" width="150">
									<template v-slot:default="{ row }">
										<span v-if="/^[1-9]\d*$/.test(row.From)" class="skip_route">
										<router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.From }} Validators</router-link>
										</span>
															<div class="name_address"
																v-if="!/^[0-9]\d*$/.test(row.From) && row.From && row.From !== '--'">
										<span class="remove_default_style skip_route"
												:class="row.From === $route.params.param ? 'no_skip' : ''">
											<router-link :to="`/address/${row.From}`" class="link_style"
														:style="{ 'font-family': row.From ? 'Consolas,Menlo' : '' }">{{ formatMoniker(row.fromMoniker) || formatAddress(row.From) }}</router-link>
										</span>
										</div>
										<span class="no_skip"
										      v-show="/^[0]\d*$/.test(row.From) || row.From === '--'">--</span>
									</template>
								</el-table-column>
								<el-table-column prop="Amount" :label="$t('ExplorerLang.table.amount')" align="right"
								                 width="110"></el-table-column>
								<el-table-column prop="To" :label="$t('ExplorerLang.table.to')" align="left"
								                 width="159">
									<template v-slot:default="{ row }">
										<span v-if="/^[1-9]\d*$/.test(row.To)" class="skip_route">
										<router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.To }} Validators</router-link>
										</span>
															<div class="name_address"
																v-show="!/^[0-9]\d*$/.test(row.To) && row.To && row.To !== '--'">
										<span class="remove_default_style skip_route"
												:class="row.To === $route.params.param ? 'no_skip' : ''">
											<router-link v-if="!(row.To === $route.params.param)" class="link_style"
														:style="{ 'font-family': row.From ? 'Consolas,Menlo' : '' }"
														:to="`/address/${row.To}`">{{ formatMoniker(row.toMoniker) || formatAddress(row.To) }}</router-link>
											<span style="cursor:pointer;font-family: Consolas, Menlo;" v-else>{{ formatMoniker(row.toMoniker) }}</span>
										</span>
										</div>
										<span class="no_skip"
										      v-show="/^[0]\d*$/.test(row.To) || row.To === '--'">--</span>
									</template>
								</el-table-column>
								<el-table-column prop="Tx_Type" :label="$t('ExplorerLang.table.txType')"
								                 show-overflow-tooltip min-width="150"></el-table-column>
								<el-table-column prop="MsgsNum" :label="$t('ExplorerLang.table.message')">
								</el-table-column>
								<el-table-column prop="Tx_Fee" :label="$t('ExplorerLang.table.fee')"
								                 width="110"></el-table-column>
								<el-table-column prop="Tx_Signer" :label="$t('ExplorerLang.table.signer')" width="121">
									<template v-slot:default="{ row }">
										<router-link :to="`/address/${row.Tx_Signer}`" class="link_style justify">{{
											formatAddress(row.Tx_Signer) }}
										</router-link>
									</template>
								</el-table-column>
								<!-- <el-table-column prop="Tx_Status" :label="$t('ExplorerLang.table.status')"
								                 width="73"></el-table-column> -->
								<el-table-column prop="Timestamp" :label="$t('ExplorerLang.table.txTimestamp')"
								                 width="186"></el-table-column>
							</el-table>
						</div>
						<m-pagination v-if="delegationTxs.total > pageSize" :page-size="pageSize"
						              :total="delegationTxs.total"
						              :page-change="pageChange('getDelegationTxs')"></m-pagination>
					</div>
				</div>
				<!-- Validation Txs -->
				<div class="validation_txs_wrap">
					<div class="validation_txs_container">
						<p class="validator_information_content_title">{{
							$t('ExplorerLang.validatorDetail.validationTxsTitle') }}</p>
						<div class="validation_txs_table_container">
							<el-table :data="validationTxs.items" style="width: 100%"
							          :empty-text="$t('ExplorerLang.table.emptyDescription')">
								<el-table-column prop="Tx_Hash" :label="$t('ExplorerLang.table.txHash')" width="110">
									<template v-slot:default="{ row }">
										<img class="status_icon"
                                     		:src="require(`../../assets/${row.Tx_Status=='Success' ? 'success.png':'failed.png'}`)"/>
										<el-tooltip :content="`${row.Tx_Hash}`">
											<router-link 
											             :to="`/tx?txHash=${row.Tx_Hash}`"
											             :style="{ color: '$theme_c !important' }">{{
												formatTxHash(row.Tx_Hash) }}
											</router-link>
										</el-tooltip>
									</template>
								</el-table-column>
								<el-table-column prop="Block" :label="$t('ExplorerLang.table.block')" width="76">
									<template v-slot:default="{ row }">
										<router-link style="font-family: Consolas,Menlo;" :to="'/block/' + row.Block"
										             :style="{ color: '$theme_c !important' }">{{ row.Block }}
										</router-link>
									</template>
								</el-table-column>
								<el-table-column prop="Moniker" :label="$t('ExplorerLang.table.name')" width="159">
									<template v-slot:default="{ row }">
										<span style="cursor:pointer;" v-if="row.OperatorAddr === $route.params.param">{{ row.Moniker }}</span>
										<router-link v-else :to="`/address/${row.OperatorAddr}`"
										             class="link_style justify">{{ formatMoniker(row.Moniker) }}
										</router-link>
									</template>
								</el-table-column>
								<el-table-column prop="OperatorAddr" :label="$t('ExplorerLang.table.operator')"
								                 width="140">
									<template v-slot:default="{ row }">
										<span v-if="/^[1-9]\d*$/.test(row.OperatorAddr)" class="skip_route">
										<router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.OperatorAddr }} Validators</router-link>
										</span>
										<div class="name_address"
										     v-show="!/^[0-9]\d*$/.test(row.OperatorAddr) && row.OperatorAddr && row.OperatorAddr !== '--'">
											<el-tooltip :content="`${row.OperatorAddr}`"
											            style="font-family: Consolas,Menlo">
												<span style="cursor:pointer;"
												      v-if="row.OperatorAddr === $route.params.param">{{ formatAddress(row.OperatorAddr) }}</span>
												<router-link v-else :to="`/address/${row.OperatorAddr}`"
												             class="link_style justify">{{
													formatAddress(row.OperatorAddr) }}
												</router-link>
											</el-tooltip>
										</div>
										<span class="no_skip"
										      v-show="/^[0]\d*$/.test(row.OperatorAddr) || row.OperatorAddr === '--'">--</span>
									</template>
								</el-table-column>
								<el-table-column prop="Self-Bonded" :label="$t('ExplorerLang.table.selfBonded')"
								                 width="159">
									<template v-slot:default="{ row }">
										<span>{{ row.SelfBonded }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="Tx_Type" :label="$t('ExplorerLang.table.txType')"
								                 show-overflow-tooltip></el-table-column>
								<el-table-column prop="Tx_Fee" :label="$t('ExplorerLang.table.fee')"
								                 width="110"></el-table-column>
								<el-table-column prop="Tx_Signer" :label="$t('ExplorerLang.table.signer')" width="121">
									<template v-slot:default="{ row }">
										<router-link :to="`/address/${row.Tx_Signer}`" class="link_style justify">{{
											formatAddress(row.Tx_Signer) }}
										</router-link>
									</template>
								</el-table-column>
								<!-- <el-table-column prop="Tx_Status" :label="$t('ExplorerLang.table.status')"
								                 width="73"></el-table-column> -->
								<el-table-column prop="Timestamp" :label="$t('ExplorerLang.table.txTimestamp')"
								                 width="186"></el-table-column>
							</el-table>
						</div>
						<m-pagination v-if="validationTxs.total > pageSize" :page-size="pageSize"
						              :total="validationTxs.total"
						              :page-change="pageChange('getValidationTxs')"></m-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ValidatorInformation from './ValidatorInformation'
	import ValidatorCommissionInformation from './ValidatorCommissionInformation'
	import MPagination from '../common/MPagination'
	import Tools from '../../util/Tools.js'
	import Constants,{ TxStatus } from '../../constant/index.js'
	import {
		getValidatorsInfoApi,
		getValidatorsDelegationsApi,
		getUnbondingDelegationsApi,
		getDelegationTxsApi,
		getValidationTxsApi
	} from "@/service/api"
	import {TxHelper} from '../../helper/TxHelper.js'
	import axios from 'axios'
	import { getMainToken } from '@/helper/IritaHelper';
	
	export default {
		name: '',
		components: {ValidatorInformation, ValidatorCommissionInformation, MPagination},
		props: {},
		data () {
			return {
				validationInformation: {},
				validatorStatus: '',
				pageSize: 5,
				delegations: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				unbondingDelegations: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				delegationTxs: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				validationTxs: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				mainToken:{},
			}
		},
		computed: {},
		watch: {},
		async created () {
			this.mainToken = await getMainToken();
			this.getValidatorsInfo()
			this.getDelegations()
			this.getUnbondingDelegations()
			this.getDelegationTxs()
			this.getValidationTxs()
		},
		mounted () {
		},
		methods: {
			pageChange (key) {
				return page => {
					this[key](page)
				}
			},
			formatPerNumber (num) {
				if (typeof num === 'number' && !Object.is(num, NaN)) {
					let afterPoint = String(num).split('.')[1]
					let afterPointLong = (afterPoint && afterPoint.length) || 0
					if (afterPointLong > 2 && num !== 0) {
						return num.toFixed(4)
					} else {
						return num.toFixed(2)
					}
				}
				return num
			},
			async getValidatorsInfo () {
				let res = await getValidatorsInfoApi(this.$route.params.param)
				this.validationInformation = res
				console.log(res,11)
				this.validatorStatus = Tools.firstWordUpperCase(res.status)
			},
			async getDelegations (page = 1) {
				const res = await getValidatorsDelegationsApi(this.$route.params.param, page, this.pageSize, true)
				this.delegations.total = res.count
				this.delegations.items = []
				res.data.forEach(item => {
					item.amount = `${Tools.formatUnit(item.amount.amount)} ${this.mainToken.symbol.toUpperCase()}`
					let selfShares = Tools.formatPriceToFixed(item.self_shares, 4)
					let shares = `${selfShares} (${this.formatPerNumber( item.total_shares ? (Number(item.self_shares) / Number(item.total_shares)) * 100 : 100)}%)`
					this.delegations.items.push({
						address: item.address,
						amount: item.amount,
						shares,
						// block: item.block,
					})
				})
			},
			async getUnbondingDelegations (page = 1) {
				const res = await getUnbondingDelegationsApi(this.$route.params.param, page, this.pageSize, true)
				this.unbondingDelegations.total = res.count
				this.unbondingDelegations.items = []
				res.data.forEach(item => {
					item.amount = Number(item.amount).toFixed(2)
					item.until = Tools.format2UTC(item.until)
					this.unbondingDelegations.items.push({
						address: item.address,
						amount: item.amount,
						block: item.block,
						end_time: item.until,
					})
				})
			},
			async getDelegationTxs (page = 1) {
				const res = await getDelegationTxsApi(this.$route.params.param, page, this.pageSize)
				this.delegationTxs.total = res.count
				this.delegationTxs.items = []
				res.data.forEach(item => {
					let msgsNumber = item.msgs ? item.msgs.length : 0, formTO;
					if (item.msgs && item.msgs.length === 1) {
						formTO = TxHelper.getFromAndToAddressFromMsg(item.msgs[0])
					} else {
						formTO = '--'
					}
					const fee = (item.fee.amount[0]) ? Tools.formatUnit(Number(item.fee.amount[0].amount)) : '--'
					const time = Tools.getDisplayDate(item.time)
					this.delegationTxs.items.push({
						Tx_Hash: item.tx_hash,
						Block: item.height,
						From: formTO.from || "--",
						Amount: fee !== '--' ? fee + this.mainToken.symbol.toUpperCase() : '--',
						To: formTO.to || '--',
						Tx_Type: item.type,
						MsgsNum: msgsNumber,
						Tx_Fee: item.fee && item.fee.amount && item.fee.amount.length > 0 ? Tools.formatAmount2(item.fee.amount, 6) : '--',
						Tx_Signer: item.signers[0] ? item.signers[0] : '--',
						Tx_Status: TxStatus[item.status],
						Timestamp: time,
					})
				})
			},
			async getValidationTxs (page = 1) {
				const res = await getValidationTxsApi(this.$route.params.param, page, this.pageSize)
				this.validationTxs.total = res.count
				this.validationTxs.items = []
				res.data.forEach(item => {
					const fee = (item.fee.amount[0]) ? (Number(item.fee.amount[0].amount) / 1000000) : '--'
					const time = Tools.getDisplayDate(item.time)
					this.validationTxs.items.push({
						Tx_Hash: item.tx_hash,
						Block: item.height,
						Moniker: item.msgs && item.msgs.length === 1 ? item.msgs[0].msg && item.msgs[0].msg.description && item.msgs[0].msg.description.moniker ? item.msgs[0].msg.description && item.msgs[0].msg.description.moniker : '--' : '--',
						OperatorAddr: item.msgs && item.msgs.length === 1 ? item.msgs[0].msg && item.msgs[0].msg.validator_address ? item.msgs[0].msg.validator_address : '--' : '--',
						SelfBonded: item.msgs && item.msgs.length === 1 ? item.msgs[0].msg && item.msgs[0].msg.min_self_delegation ? item.msgs[0].msg.min_self_delegation : '--' : '--',
						'Tx_Type': item.type,
						'Tx_Fee': item.fee && item.fee.amount && item.fee.amount.length > 0 ? Tools.formatAmount2(item.fee.amount, 6) : '--',
						'Tx_Signer': item.signers[0] ? item.signers[0] : '--',
						'Tx_Status': TxStatus[item.status],
						Timestamp: time,
					})
				})
			},
			formatAddress (address) {
				return Tools.formatValidatorAddress(address)
			},
			formatTxHash (TxHash) {
				if (TxHash) {
					return Tools.formatTxHash(TxHash)
				}
			},
			formatMoniker (moniker) {
				if (!moniker) {
					return ''
				}
				return Tools.formatString(moniker, 15, '...')
			},
		},
	}
</script>

<style lang="scss" scoped>
	a {
		color: $t_link_c !important;
	}
	
	.vaildtor_detail_container {
		.vaildtor_detail_content {
			max-width: 12.8rem;
			margin: 0 auto;
			padding: 0 0.15rem;
			text-align: left;
			
			.vaildtor_detail_title_container {
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
			
			.validation_information_container {
				margin-top: 0.1rem;
			}
			
			.delegations_wrap {
				margin: 0 auto;
				
				.delegations_container {
					display: flex;
					
					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.3rem;
						padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}
					
					.one_table_container {
						width: calc(50% - 0.1rem);
					}
					
					.second_table_container {
						margin-left: 0.2rem;
						width: calc(50% - 0.1rem);
					}
					
					.delegations_table_container {
						overflow-x: auto;
						border: 0.01rem solid $bd_first_c;
						background: $bg_white_c;
					}
				}
				
				.common_pagination_content {
					margin-top: 0.2rem;
					float: right;
				}
			}
			
			.delegations_txs_wrap {
				margin: 0 auto;
				
				.delegations_txs_container {
					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.3rem;
						padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}
					
					.delegations_txs_table_container {
						overflow-x: auto;
						border: 0.01rem solid $bd_first_c;
						background: $bg_white_c;

						.status_icon{
							width:0.13rem;
							height:0.13rem;
							margin-right:0.05rem;
						}
						
						/deep/ .el-table_3_column_12 {
							text-align: right;
						}
						
						/deep/ .el-table_3_column_13 {
							text-align: left;
						}
					}
					
					.common_pagination_content {
						margin-top: 0.2rem;
						float: right;
					}
				}
			}
			
			.validation_txs_wrap {
				margin: 0 auto;
				margin-bottom: 0.5rem;
				
				.validation_txs_container {
					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.3rem;
						padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}
					
					.validation_txs_table_container {
						overflow-x: auto;
						border: 0.01rem solid $bd_first_c;
						background: $bg_white_c;
						
						.status_icon{
							width:0.13rem;
							height:0.13rem;
							margin-right:0.05rem;
						}
					}
					
					.common_pagination_content {
						margin-top: 0.2rem;
						float: right;
						margin-bottom: 0.5rem;
					}
				}
			}
		}
	}

	@media screen and (max-width: 1050px){
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.vaildtor_detail_title_container {
					margin-left: 0.2rem;
				}
				.delegations_wrap {
					.delegations_container{
						margin: 0 0.2rem;
					}
				}
				.delegations_txs_wrap {
					.delegations_txs_container{
						margin: 0 0.2rem;
					}
				}
				.validation_txs_wrap {
					.validation_txs_container {
						margin: 0 0.2rem;
					}
				}
			}
		}
	}

	@media screen and (max-width: 910px) {
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.vaildtor_detail_title_container {
				}
				
				.validation_information_container {
				}
				
				.delegations_wrap {
					.delegations_container {
						display: block;
						margin-left: 0.2rem;
						
						.validator_information_content_title {
						}
						
						.one_table_container {
							width: 100%;
						}
						
						.second_table_container {
							width: 100%;
							margin-left: 0rem;
						}
						
						.delegations_table_container {
						}
						
						.common_pagination_content {
						}
					}
				}
			}
		}
	}

	@media screen and (max-width: 750px){
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.vaildtor_detail_title_container {
					margin-left: 0.2rem;
				}
				.delegations_wrap {
					.delegations_container{
						margin: 0 0.1rem;
					}
				}
				.delegations_txs_wrap {
					.delegations_txs_container{
						margin: 0 0.1rem;
					}
				}
				.validation_txs_wrap {
					.validation_txs_container {
						margin: 0 0.1rem;
					}
				}
			}
		}
	}
</style>

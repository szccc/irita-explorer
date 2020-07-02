<template>
	<div class="validator_list_container">
		<div class="validator_list_content_wrap">
			<div class="validator_tab_content">
				<m-tabs :data="validatorStatusTitleList" :chose="selectValidatorStatus"></m-tabs>
			</div>
			<div class="validator_table_list_content">
				<el-table :data="validatorList">
					<el-table-column label="#" prop="index" width="50px"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.validators.name')" prop="name" width="200px"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.validators.operator')" width="200px">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.operator"
							            placement="top"
							            effect="dark">
								<span>{{formatAddress(scope.row.operator)}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
<!--					<el-table-column label="Website" prop="website"></el-table-column>-->
<!--					<el-table-column label="Identity" prop="identity"></el-table-column>-->
<!--					<el-table-column label="Details" prop="detail"></el-table-column>-->
<!--					<el-table-column label="Proposer Priority" prop="proposerPriority"></el-table-column>-->
					<el-table-column :label="$t('ExplorerCN.validators.votingPower')" width="150px" prop="votingPower"></el-table-column>
					<el-table-column :label="$t('ExplorerCN.validators.pubKey')" prop="pubKey" width="450px"></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	import { getValidatorList } from "../service/api"
	import Tools from "../util/Tools"
	import MTabs from "./MTabs";
	export default {
		name: "ValidatorList",
		components: {MTabs},
		data(){
			return {
				pageNumber:1,
				pageSize: 100,
				validatorList: [],
				status:'bonded',
				validatorStatusTitleList:[
					{
						title:'共识中',
						isActive: true,
						name:'bonded'
					},
					// {
					// 	title:'候选中',
					// 	isActive: false,
					// 	name:'unbonding'
					// },
					{
						title:'待解禁',
						isActive: false,
						name:'unbonded'
					}
				],
				proposerPriority:'',
				votingPower:'',
				pubKey:'',
			}
		},
		mounted () {
			this.validatorListRequest();
		},
		methods:{
			selectValidatorStatus(index){
				index = index || 0;
				this.validatorStatusTitleList.forEach( item => {
					item.isActive = false
				});
				// localStorage.setItem('validatorTabIndex',index);
				this.validatorStatusTitleList[index].isActive = true;
				this.status = this.validatorStatusTitleList[index]['name'];
				// this.getValidatorStatus(index);
				this.validatorListRequest()
			},
			// getValidatorStatus(index){
			// 	let validatorStatus;
			// 	switch (index) {
			// 		case 0 :
			// 			this.status = 'bonded';
			// 			break;
			// 		case 1 :
			// 			this.status = 'unbonding';
			// 			break;
			// 		case 2 :
			// 			this.status = 'unbonded'
			// 	}
			// 	return validatorStatus
			// },
			async validatorListRequest(){
				try {
					let validatorsData = await getValidatorList(this.status=='unbonded', this.pageNumber, this.pageSize, true);
					if(validatorsData && validatorsData.data && validatorsData.data.length){
						this.validatorList = validatorsData.data.map((item,index) => {
							return {
								index:index + 1,
								name: item.name,
								// moniker: item.description.moniker,
								operator: item.operator,
								// proposerPriority: item.proposer_priority,
								votingPower: item.power,
								pubKey: item.pubkey,
								// website: item.description.website ? item.description.website : '--',
								// identity: item.description.identity ? item.description.identity : '--',
								// detail: item.description.detail ? item.description.detail : '--',
							}
						})
					}else {
						this.validatorList = []
					}
				}catch (e) {
					console.error(e)
				}
				// Service.commonInterface({validatorList:{
				// 		status: this.status,
				// 		pageNum: this.pageNumber,
				// 		pageSize: this.pageSize
				// 	}},(res) => {
				// 	try {
				// 		if(res.length > 0){
				// 			this.validatorList = res.map((item,index) => {
				// 				return {
				// 					index:index + 1,
				// 					name: item.name,
				// 					// moniker: item.description.moniker,
				// 					operator: item.address,
				// 					proposerPriority: item.proposer_priority,
				// 					votingPower: item.voting_power,
				// 					pubKey: item.pub_key,
				// 					// website: item.description.website ? item.description.website : '--',
				// 					// identity: item.description.identity ? item.description.identity : '--',
				// 					// detail: item.description.detail ? item.description.detail : '--',
				// 				}
				// 			})
							
				// 		}else {
				// 			this.validatorList = []
				// 		}
				// 	}catch (e) {
				// 		console.error(e)
				// 	}
				// })
			},
			formatAddress(address){
				return Tools.formatValidatorAddress(address)
			},
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.validator_list_container{
        width:100%;
        @media screen and (min-width: 910px){
            .validator_list_content_wrap{
                max-width: 12rem;

            }

        }
        @media screen and (max-width: 910px){
            .validator_list_content_wrap{
                width:100%;
                padding:0 0.15rem;

            }

        }
		.validator_list_content_wrap{
			margin: 0 auto;
            box-sizing: border-box;
			.validator_table_list_content{
				background: #fff;
				margin-top: 0.1rem;
			}
		}
	}
</style>

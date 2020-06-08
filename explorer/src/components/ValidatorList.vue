<template>
	<div class="validator_list_container">
		<div class="validator_list_content_wrap">
			<div class="validator_tab_content">
				<m-tabs :data="validatorStatusTitleList" :chose="selectValidatorStatus"></m-tabs>
			</div>
			<div class="validator_table_list_content">
				<el-table :data="validatorList">
					<el-table-column label="#" prop="index" width="150px"></el-table-column>
<!--					<el-table-column label="Moniker" prop="moniker"></el-table-column>-->
					<el-table-column label="Operator" width="200px">
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
					<el-table-column label="Voting Power" width="200px" prop="votingPower"></el-table-column>
					<el-table-column label="Pub Key" prop="pubKey"></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	import Service from "../service"
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
						title:'Active',
						isActive: true,
					},
					{
						title:'Candidate',
						isActive: false,
					},
					{
						title:'Jailed',
						isActive: false,
					}
				],
				proposerPriority:'',
				votingPower:'',
				pubKey:'',
			}
		},
		mounted () {
			this.getValidatorList();
		},
		methods:{
			selectValidatorStatus(index){
				index = index || 0;
				this.validatorStatusTitleList.forEach( item => {
					item.isActive = false
				});
				// localStorage.setItem('validatorTabIndex',index);
				this.validatorStatusTitleList[index].isActive = true;
				this.getValidatorStatus(index);
				this.getValidatorList()
			},
			getValidatorStatus(index){
				let validatorStatus;
				switch (index) {
					case 0 :
						this.status = 'bonded';
						break;
					case 1 :
						this.status = 'unbonding';
						break;
					case 2 :
						this.status = 'unbonded'
				}
				return validatorStatus
			},
			getValidatorList(){
				Service.commonInterface({validatorList:{
						status: this.status,
						pageNum: this.pageNumber,
						pageSize: this.pageSize
					}},(res) => {
					try {
						if(res.length > 0){
							this.validatorList = res.map((item,index) => {
								return {
									index:index + 1,
									// moniker: item.description.moniker,
									operator: item.address,
									proposerPriority: item.proposer_priority,
									votingPower: item.voting_power,
									pubKey: item.pub_key,
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
				})
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
		.validator_list_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.validator_table_list_content{
				background: #fff;
				margin-top: 0.1rem;
			}
		}
	}
</style>

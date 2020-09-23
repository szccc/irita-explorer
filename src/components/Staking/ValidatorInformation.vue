<template>
	<div class="validation_information_container">
		<div class="validation_information_wrap">
			<div class="validation_information_content">
				<!-- 左侧头像 -->
				<div class="validation_information_header_content">
					<!-- 头像模块 -->
					<div class="validation_information_header_img">
						<!-- 大写的一个字母 -->
						<span>{{validatorIconSrc}}</span>
						<!-- 有图片地址就显示图片，使用定位覆盖，如果地址有误则validatorIconHref='' -->
						<img v-show="validatorIconHref" :src="validatorIconHref" alt="" @error="imgLoadError()">
					</div>
					<!-- moniker 验证人的名称 -->
					<p class="validation_information_moniker">{{moniker}}</p>
					<!-- website 网站 -->
					<p class="validation_information_website" v-if="website">
						<!-- 网站可点击另开窗口打开 -->
						<span class="validation_website_link" @click="openUrl(website)">{{website}}</span>
					</p>
					<!-- identity 身份-->
					<p class="validation_information_identity" v-if="identity">
						<!-- 有keyBaseName说明有地址就是链接 -->
						<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
						<!-- 没有就直接渲染 -->
						<span class="validation_information_not_link" v-else>{{identity}}</span>
					</p>
					<!-- details 详情 -->
					<p class="validation_information_details" v-if="details">{{details}}</p>
					<!-- 没有网站、身份、详情，则显示没有信息 -->
					<p class="validation_information_no_more" v-if="!website && !identity && !details">~ {{$t('ExplorerLang.staking.validatorInformation.validatorTip')}} ~</p>
				</div>
				<!-- 右侧详细信息 -->
				<div class="validation_information_asset_information_content">
					<!-- 根据validatorStatus显示验证人的状态 -->
					<div class="validation_information_status_content">
						<span class="status_btn" v-if="validatorStatus === 'Active'">Active</span>
						<span
								class="status_btn"
								style="background-color: #3DA87E;"
								v-if="validatorStatus === 'Candidate'"
						>Candidate</span>
						<span
								class="status_btn"
								style="background-color: #FA7373;"
								v-if="validatorStatus === 'Jailed'"
						>Jailed</span>
					</div>
					<!-- 展示详细的数据 -->
					<ul class="validation_information_list_content">
						<!-- 循环 li -->
						<li class="validation_information_item" v-for="(item, index) in validationAssetInfoArr" :key="index" v-show="showVotingPower(validatorStatus,item.label)">
							<!-- 左侧 -->
							<div class="validation_information_item_label_content">
								<!-- 标题 -->
								<span>{{item.label}}</span>
								<!-- 判断是否需要显示提示符号 -->
								<el-tooltip v-if="item.isToolTip" class="tip_content" :content="$t('ExplorerLang.staking.validatorInformation.operatorAddressTip')">
									<span class="el-icon-warning-outline"></span>
								</el-tooltip>
							</div>
							<!-- 右侧 -->
							<div class="validation_information_item_value_content">
								<p>
									<span class="validation_information_item_value">
										<!-- 判断是否需要显示提示信息 -->
										<el-tooltip v-if="item.isCopyIcon" :content="`${item.value}`">
											<!-- 判断是否为地址链接，不是则直接渲染 -->
											<span v-if="item.flAddressLink" style="font-family: Consolas,Menlo;">{{formatAddress(item.value)}}</span>
											<router-link style="font-family: Consolas,Menlo;" v-if="!item.flAddressLink" :to="'/address/'+ item.value" :style="{color: item.isValidatorAddress ? '' :'$theme_c !important'}">{{formatAddress(item.value)}}</router-link>
										</el-tooltip>
										<!-- 不用显示复制的图标 直接渲染数据 -->
										<span v-if="!item.isCopyIcon">
											{{item.value}}
										</span>
										<!-- 判断是否需要显示复制图标 -->
										<!-- 封装好的组件，直接用，使用了插件Clipboard可复制文本到剪贴板 -->
										<m-clip v-if="item.isCopyIcon" style="margin-left: 0.06rem;cursor: pointer;" :text="item.value ? item.value : ''" ></m-clip>
									</span>
								</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import MClip from "../common/MClip.vue";
	import Tools from "../../util/Tools.js";
	import axios from "../../axios/index.js";
	export default {
		name: "ValidationInformation",
		components: {MClip},
		props:{
			// https://www.irisplorer.io/api/stake/validators/iva1543nj4z07vjqztvu3358fr2z2hcp0qtmceank5 这个接口拿到的数据
			// {
			// "total_power": 780315466,
			// "self_power": 83033858,
			// "status": "Active",
			// "bonded_tokens": "83033857.7678013329966332980000000000",
			// "self_bonded": "0.999699999999352290",
			// "bonded_stake": "83033856.768101332997281008",
			// "delegator_shares": "83058775.4004752735399909333337001100",
			// "delegator_count": 188,
			// "commission_rate": "0.0200000000",
			// "commission_update": "2020-07-28 19:38:32.857 +0800 CST",
			// "commission_max_rate": "1.0000000000",
			// "commision_max_change_rate": "1.0000000000",
			// "bond_height": "6932060",
			// "unbond_height": "",
			// "jailed_until": "",
			// "missed_blocks_count": "1",
			// "operator_addr": "iva1543nj4z07vjqztvu3358fr2z2hcp0qtmceank5",
			// "owner_addr": "iaa1543nj4z07vjqztvu3358fr2z2hcp0qtmdghutn",
			// "consensus_addr": "icp1zcjduepq9e2rwwe0jznnw26w50tr3t4axuyurs29mrfm4w9dqr8xks0ysyequeamlj",
			// "description": {
			// "moniker": "Binance Validator"
			// },
			// "icons": "",
			// "uptime": 0.9999711,
			// "stats_blocks_window": "34560"
			// }
			// 验证人的信息 赋值给 组件自身的数据informationData
			validationInformation:{
				type: Object
			},
			// 验证人的状态
			validatorStatus:{
				type: String
			}
		},
		data () {
			return {
				// 验证人的信息
				informationData:"",
				// 验证人图标的大写字母
				validatorIconSrc:'',
				// 验证人图标的地址
				validatorIconHref:"",
				// 验证人名字
				moniker:'',
				// 网站
				website:'',
				// 身份
				identity:'',
				// 详情
				details:'',
				// 验证人的状态
				validationStatus:'',
				// 是否有链接需跳转
				keyBaseName:'',
				// 右侧信息栏的详细数据
				validationAssetInfoArr:[
					{
						// 标题
						label:'Operator Address:',
						// 数据名称，可通过这个来获取value
						dataName:'operator_addr',
						// 右侧渲染的数据
						value:'',
						// 判断是否需要显示提示符号
						isToolTip:true,
						// 判断是否需要显示复制图标
						isCopyIcon:true,
						// 判断是否是验证人的地址
						isValidatorAddress:true,
						// 判断是否是地址链接
						flAddressLink:true,
					},
					{
						label:'Owner Address:',
						dataName:'owner_addr',
						value:'',
						isToolTip:false,
						isCopyIcon:true,
						flAddressLink:false,
					},
					{
						label:'Withdraw Address:',
						dataName:'address',
						value:'',
						isToolTip:false,
						isCopyIcon:true,
						flAddressLink:false,
					},
					{
						label:'Voting Power:',
						dataName:'self_power',
						value:'',
						isToolTip:false,
						isCopyIcon:false,
						flAddressLink:false,
					},
					{
						label:'Uptime:',
						dataName:'uptime',
						value:'',
						isToolTip:false,
						isCopyIcon:false,
						flAddressLink:false,
					},
					{
						label:'Missed Blocks:',
						dataName:'missed_blocks_count',
						value:'',
						isToolTip:false,
						isCopyIcon:false,
						flAddressLink:false,
					},
					{
						label:'Bond Height:',
						dataName:'bond_height',
						value:'',
						isToolTip:false,
						isCopyIcon:false,
						flAddressLink:false,
					},
					{
						label:'Unbonding Height:',
						dataName:'unbond_height',
						value:'',
						isToolTip:false,
						isCopyIcon:false,
						flAddressLink:false,
					},
					{
						label:'Consensus Pubkey:',
						dataName:'consensus_addr',
						value:'',
						isToolTip:false,
						isCopyIcon:true,
						flAddressLink:true,
					},
					{
						label:'Jailed Until:',
						dataName:'jailed_until',
						value:'',
						isToolTip:false,
						isCopyIcon:false,
						flAddressLink:false,
					}
				]
			}
		},
		watch:{
			validationInformation(){
				this.informationData = this.validationInformation;
				// 处理后台返回的数据
				this.handlePropsData()
			}
		},
		mounted () {
			this.informationData = this.validationInformation;
			this.getValidatorWithdrawAddr()
		},
		methods:{
			// 图片地址错误 处理的方法
			imgLoadError(){
				this.validatorIconHref = ""
			},
			// 控制右侧详细信息 是否展示和隐藏
			showVotingPower(validatorStatus,labelName){
				if(validatorStatus === 'Candidate' || validatorStatus === 'Jailed'){
					if(labelName === 'Voting Power:' || labelName === 'Bond Height:'){
						return false
					}else {
						return true
					}
				}else {
					if(labelName === 'Jailed Until:' || labelName === 'Unbonding Height:'){
						return false
					}
					return true
				}
				
			},
			// 处理后台返回的数据
			handlePropsData(){
				let information = this.informationData;
				//匹配第一个字符用于头像展示
				let regex =  /[^\w\u4e00-\u9fa50-9a-zA-Z]/g;
				let replaceMoniker = information.description.moniker.replace(regex,'');
				this.validatorIconSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : '';
				this.validatorIconHref = information.icons ? information.icons : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg');
				this.moniker = information.description.moniker;
				this.website = information.description.website ? information.description.website : '';
				if(information.description.identity){
					// 如果有identity数据，发送请求，拿到keyBaseName
					this.getKeyBaseName(information.description.identity)
				}
				this.identity = information.description.identity ? information.description.identity : '';
				this.details = information.description.details ? information.description.details : '';
				// 处理右侧需渲染的详细数据，设置value
				this.validationAssetInfoArr.forEach( item => {
					if(item.dataName !== 'address'){
						if(item.dataName === 'uptime'){
							item.value = Tools.FormatUptime(information[item.dataName]);
						}else if(item.dataName === 'self_power') {
							item.value = information.status === "Active"
								? `${information.self_power} (${this.formatPerNumber((information.self_power / information.total_power) * 100)} %)`
								: "";
						}else if(item.dataName === 'missed_blocks_count'){
							item.value = `${information.missed_blocks_count} in ${information.stats_blocks_window} blocks`;
						}else if(item.dataName === 'jailed_until'){
							item.value = new Date(information[item.dataName]).getTime() ? Tools.format2UTC(information[item.dataName]) : "--";
						}else {
							item.value = information[item.dataName];
						}
					}
				})
			},
			// 处理需打开的网站地址
			openUrl(url) {
				url = url.trim();
				if (url) {
					if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
						url = `http://${url}`;
					}
					window.open(url);
				}
			},
			// 处理identity，拿到keyBaseName数据
			getKeyBaseName(identity) {
				let url = `https://keybase.io/_/api/1.0/user/lookup.json?fields=basics&key_suffix=${identity}`;
				if (identity) {
					axios.http(url).then(res => {
						if (res.them && res.them.length > 0 && res.them[0].basics && res.them[0].basics.username) {
							this.keyBaseName = `https://keybase.io/${res.them[0].basics.username}`;
						}else {
							this.keyBaseName = ''
						}
					});
				}
			},
			// 处理地址
			formatAddress (address) {
				return Tools.formatValidatorAddress(address);
			},
			getValidatorWithdrawAddr() {
				// https://www.irisplorer.io/api/stake/validators/iva1543nj4z07vjqztvu3358fr2z2hcp0qtmceank5/withdraw-addr
				let url = `https://www.irisplorer.io/api/stake/validators/${this.$route.params.param}/withdraw-addr`;
				try {
					axios.http(url).then(res => {
						if (res) {
								this.validationAssetInfoArr.forEach( item => {
									if(item.dataName === 'address')
									item.value = res[item.dataName];
								})
							}
					})
				}  catch (e) {
					console.error(e)
				}
				// Service.commonInterface(
				// 	{
				// 		validatorWithdrawAddr: {
				// 			validatorAddr: this.$route.params.param
				// 		}
				// 	},
				// 	(data) => {
				// 		try {
				// 			if (data) {
				// 				this.validationAssetInfoArr.forEach( item => {
				// 					if(item.dataName === 'address')
				// 					item.value = data[item.dataName];
				// 				})
				// 			}
				// 		} catch (e) {
				// 			console.error(e)
				// 		}
				// 	}
				// );
			},
			// 处理Voting Power:中的value值
			formatPerNumber(num) {
				if (typeof num === "number" && !Object.is(num, NaN)) {
					let afterPoint = String(num).split(".")[1];
					let afterPointLong = (afterPoint && afterPoint.length) || 0;
					if (afterPointLong > 2 && num !== 0) {
						return num.toFixed(4);
					} else {
						return num.toFixed(2);
					}
				}
				return num;
			},
		}
	}
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}
.validation_information_container{
	width: 100%;
	margin-top: 0.74rem;
	.validation_information_wrap{
		max-width: 12.8rem;
		margin: 0 auto;
		border:0.01rem solid #E7E9EB;
		.validation_information_content{
			width: 100%;
			background: #fff;
			display: grid;
			grid-template-columns: repeat(2,50%);
			.validation_information_header_content{
				display: flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				margin: 0.3rem 0 0.38rem 0;
				.validation_information_header_img{
					width: 1.2rem;
					height: 1.2rem;
					border-radius: 0.6rem;
					background: #E0E8FF;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					img{
						position: absolute;
						width: 100%;
					}
					span{
						font-size: 0.52rem;
					}
				}
				.validation_information_moniker{
					margin-top: 0.1rem;
					font-size: 0.2rem;
					line-height: 0.23rem;
					font-weight: bold;
				}
				.validation_information_website{
					margin-top: 0.15rem;
					.validation_website_link{
						font-size: 0.14rem;
						line-height: 0.16rem;
						color:$theme_c;
						cursor: pointer;
					}
				}
				.validation_information_identity{
					margin-top: 0.1rem;
					.validation_information_link{
						color:$theme_c !important;
						font-size: 0.14rem;
						line-height: 0.16rem;
					}
					.validation_information_not_link{
						color:$t_first_c;
						font-size: 0.14rem;
						line-height: 0.16rem;
					}
				}
				.validation_information_details{
					max-width: 5rem;
					margin-top: 0.1rem;
					font-size: 0.14rem;
					line-height: 0.21rem;
					color: $t_first_c;
				}
				.validation_information_no_more{
					margin-top: 0.55rem;
					color: $t_second_c;
					font-size: 0.14rem;
					line-height: 0.21rem;
				}
			}
			.validation_information_asset_information_content{
				box-sizing: border-box;
				margin: 0.3rem 0;
				border-left: 0.01rem dashed #D7DCE0;
				padding:0 0 0.3rem 0.7rem;
				.validation_information_status_content{
					.status_btn{
						height: 0.26rem;
						line-height: 0.26rem;
						padding: 0.05rem 0.16rem;
						background: $theme_c;
						color:#fff;
						border-radius: 0.13rem;
					}
				}
				.validation_information_list_content{
					.validation_information_item{
						display: grid;
						grid-template-columns: repeat(1,1.5rem auto);
						margin-top: 0.16rem;
						font-size: 0.14rem;
						.validation_information_item_label_content{
							span{
								color: $t_second_c;
							}
							.tip_content{
								margin-left: 0.01rem;
							}
						}
						.validation_information_item_value_content{
							display: flex;
							span{
								word-break: break-all;
							}
							.validation_information_item_value{
								margin-right: 0.06rem;
							}
						}
					}
				}
			}
		}
	}
}
	@media screen and (max-width: 1050px){
		.validation_information_container{
			.validation_information_wrap{
				margin: 0 0.2rem;
				.validation_information_content{
					width: 100%;
					grid-template-columns: repeat(1,auto);
					grid-template-rows: repeat(2,auto);
					.validation_information_header_content{
						align-items: flex-start;
						margin:0.3rem 0.15rem;
					}
					.validation_information_asset_information_content{
						border-top: 0.01rem solid #D7DCE0;
						margin: 0.15rem;
						padding: 0.3rem 0 0 0;
						border-left: none;
						.validation_information_item{
						
						}
					}
				}
			}
		}
	}
	@media screen and (max-width: 910px){
		.validation_information_container{
			margin-top: 0.2rem;
		}
	}
	@media screen and (max-width: 768px){
		.validation_information_container{
			margin-top: 0.2rem;
			.validation_information_wrap{
				margin: 0 0.1rem;
				.validation_information_content{
					.validation_information_header_content{
						align-items: center;
					}
				}
			}
		}
	}
</style>

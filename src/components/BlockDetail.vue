<template>
	<div class="block_detail_container">
		<div class="block_detail_content_wrap">
			<div class="block_detail_header_content">
				 <span class="block_height_content">
                    <i :class="active?'flag_item_left':'flag_item_left_disabled'" class="iconfont iconshangyigequkuai" @click="skipNext(-1)"></i>
                        <span class="information_value" style="flex:none;">{{heightValue}}</span>
                    <i :class="activeNext?'flag_item_right':'flag_item_right_disabled'" class="iconfont iconxiayigequkuai" @click="skipNext(1)"></i>
                </span>
			</div>
			<div class="block_detail_content">
				<p>
					<span>{{$t('ExplorerLang.blockDetail.blockHash')}}</span>
					<span style="word-break: break-all;">{{blockHash}}</span>
				</p>
				<p>
					<span>{{$t('ExplorerLang.blockDetail.transaction')}}</span>
					<span>{{txNumber}}</span>
				</p>
				<p>
					<span>{{$t('ExplorerLang.blockDetail.timestamp')}}</span>
					<span>{{time}}</span>
				</p>
			</div>
			<div class="block_transaction_content" v-if="transactionArray.length > 0">
				<div class="block_transaction_title_content">{{$t('ExplorerLang.blockDetail.transactions')}}</div>
				<TxListComponent :txData="transactionArray"></TxListComponent>
			</div>
		</div>
	</div>
</template>

<script>
	import TxListComponent from "./common/TxListComponent";
	import { getBlockWithHeight, getLatestBlock, getBlockTxList } from '../service/api';
	import Tools from "../util/Tools";
  	import { TxHelper } from "../helper/TxHelper";
  	import { TX_TYPE,TX_STATUS } from '../constant';
	export default {
		name: "BlockDetail",
		components:{ TxListComponent },
		data(){
			return {
				TX_TYPE,
				TX_STATUS,
				blockHash: 0,
				txNumber:0,
				time:'',
				active: true,
				activeNext: true,
				maxBlock: 0,
				heightValue: '',
				transactionArray:[]
			}
		},
		watch:{
			$route() {
				this.getBlockInformation();
				this.getTransactionList();
				this.latestBlock()
				if (Number(this.$route.params.height) <= 1) {
					this.active = false;
				} else {
					this.active = true;
				}
				if (this.maxBlock !== 0) {
					if (Number(this.$route.params.height) >= this.maxBlock) {
						this.activeNext = false;
					} else {
						this.activeNext = true;
					}
				}
			}
		},
		mounted () {
			this.getBlockInformation();
			this.getTransactionList();
			this.latestBlock()
			if (Number(this.$route.params.height) > 1) {
				this.active = true;
				this.activeNext = true;
			} else {
				this.active = false;
				this.activeNext = false
			}
		},
		methods:{
			async latestBlock(){
				try {
					let blockData = await getLatestBlock();
					if(blockData){
						this.getMaxBlock(blockData.height);
					}
				}catch (e) {
					console.error(e)
				}				
			},
			async getBlockInformation(){
				try {
					let blockData = await getBlockWithHeight(this.$route.params.height);
					if(blockData){
						this.heightValue = blockData.height;
						this.blockHash = blockData.hash;
						this.txNumber = blockData.txn;
						this.time = Tools.getDisplayDate(blockData.time);
					}
				}catch (e) {
					console.error(e)
				}
			},
			getMaxBlock(latestHeight) {
				this.maxBlock = latestHeight;
				if (Number(this.$route.params.height) >= Number(latestHeight)) {
					this.activeNext = false;
				} else {
					this.activeNext = true;
				}
			},
			async getTransactionList(){
                try {
                    const res = await getBlockTxList(this.$route.params.height);
                    if(res){
                        this.transactionArray = res.data;
                    }
                }catch (e) {
                		console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.txListFailed'));
                }
			},
			skipNext(num) {
				if(Number(this.$route.params.height) >= 1){
					if (Number(this.$route.params.height) <= 1) {
						this.active = false;
						if (num !== -1) {
							this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
						}
					} else if (Number(this.$route.params.height) >= this.maxBlock) {
						if (num !== 1) {
							this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
						}
					} else {
						this.active = true;
						this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
					}
				}
			},
			formatTxHash(TxHash){
				if(TxHash){
					return Tools.formatTxHash(TxHash)
				}
			},
			formatAddress(address){
				return Tools.formatValidatorAddress(address)
			},
			pageChange(pageNum) {
				this.pageNum = pageNum;
				this.getTxByAddress();
			}
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: $t_link_c !important;
	}
	.block_detail_container{
		padding: 0 0.15rem;
		.block_detail_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.block_detail_header_content{
				margin: 0.3rem 0 0.1rem 0;
				text-align: left;
				padding-left: 0.2rem;
				.block_height_content{
					.information_value{
						font-size: $s22;
						color: $t_second_c;
						margin: 0 0.07rem;
					}
					.flag_item_left {
						display: inline-block;
						font-size: $s20;
						margin-right: 0.05rem;
						cursor: pointer;
						color: $t_link_c !important;
					}
					.flag_item_left_disabled {
						display: inline-block;
						font-size: $s20;
						margin-right: 0.05rem;
						cursor: pointer;
						color: $t_second_c;
					}
					.flag_item_right {
						display: inline-block;
						font-size: $s20;
						margin-left: 0.05rem;
						color: $t_link_c;
						cursor: pointer;
					}
					.flag_item_right_disabled {
						display: inline-block;
						font-size: $s20;
						color: $t_second_c;
						margin-left: 0.05rem;
						cursor: pointer;
					}
				}
			}
			.block_detail_content{
				padding: 0.2rem;
				box-sizing: border-box;
				background: $bg_white_c;
				p{
					display: flex;
					margin-bottom: 0.16rem;
					span:nth-of-type(1){
						text-align: left;
						color: $t_second_c;
						font-size: $s14;
						min-width: 1.5rem;
					}
					span:nth-of-type(2){
						text-align: left;
						color: $t_first_c;
						font-size: $s14;
						flex: 1;
					}
				}
				p:last-child{
					margin-bottom: 0;
				}
			}
			.block_transaction_content{
				.block_transaction_title_content{
					font-size: $s18;
					font-weight: bold;
					margin: 0.3rem 0 0.1rem 0;
					text-align: left;
					text-indent: 0.2rem;
				}
				.tx_transaction_content_hash{
            display: flex;
            align-items: center;
        }
			}
			.status_icon{
	        width:0.13rem;
	        height:0.13rem;
	        margin-right:0.05rem;
	    }
		}
	}


@media screen and (max-width: 768px) {
	.block_detail_container{
		.block_detail_content_wrap{
			.block_detail_header_content{
				.block_height_content{
					.information_value{
						
					}
					.flag_item_left {
						
					}
					.flag_item_left_disabled {
						
					}
					.flag_item_right {
						
					}
					.flag_item_right_disabled {
						
					}
				}
			}
			.block_detail_content{
				
				p{
					
					span:nth-of-type(1){
						min-width: 1rem;
					}
					span:nth-of-type(2){
						
					}
				}
				p:last-child{
					
				}
			}
			.block_transaction_content{
				.block_transaction_title_content{
					
				}
			}
		}
	}
}
</style>

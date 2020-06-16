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
					<span>{{$t('ExplorerCN.blockDetail.blockHash')}}</span>
					<span>{{blockHash}}</span>
				</p>
				<p>
					<span>{{$t('ExplorerCN.blockDetail.transaction')}}</span>
					<span>{{txNumber}}</span>
				</p>
				<p>
					<span>{{$t('ExplorerCN.blockDetail.timestamp')}}</span>
					<span>{{time}}</span>
				</p>
			</div>
			<div class="block_transaction_content" v-if="transactionArray.length > 0">
				<div class="block_transaction_title_content">{{$t('ExplorerCN.blockDetail.transactions')}}</div>
				<div class="block_transaction_list_content">
					<el-table :data="transactionArray">
						<el-table-column :label="$t('ExplorerCN.transactions.txHash')">
							<template slot-scope="scope">
								<router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.block')" prop="blockHeight"></el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.txType')" prop="txType"></el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.from')">
							<template slot-scope="scope">
								<router-link v-if="scope.row.from !== '--'" :to="`/address/${scope.row.from}`">{{formatAddress(scope.row.from)}}</router-link>
								<span v-if="scope.row.from === '--'">--</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.to')">
							<template slot-scope="scope">
								<router-link v-if="scope.row.to !== '--'" :to="`/address/${scope.row.to}`">{{formatAddress(scope.row.to)}}</router-link>
								<span v-if="scope.row.to === '--'">--</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.signer')">
							<template slot-scope="scope">
								<router-link :to="`/address/${scope.row.signer}`">{{formatAddress(scope.row.signer)}}</router-link>
							</template>
						</el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.status')" prop="status"></el-table-column>
						<el-table-column :label="$t('ExplorerCN.transactions.timestamp')" prop="time" width="200px">
							<template slot-scope="scope">
								<span>{{scope.row.time}}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Service from '../service'
	import Tools from "../util/Tools"
    import { HttpHelper } from '../helper/httpHelper';
	export default {
		name: "BlockDetail",
		data(){
			return {
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
				this.getLatestBlock()
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
			this.getLatestBlock()
			if (Number(this.$route.params.height) > 1) {
				this.active = true;
				this.activeNext = true;
			} else {
				this.active = false;
				this.activeNext = false
			}
		},
		methods:{
			getLatestBlock(){
				Service.commonInterface({latestBlock:{}},(data) => {
					try {
						if(data && data.block && data.block.header){
							this.getMaxBlock(data.block.header.height);
						}
					}catch (e) {
						console.error(e)
					}
				})
				
			},
			getBlockInformation(){
				Service.commonInterface({blockInformation: {
						height:this.$route.params.height
					}},(data) => {
					try {
						if(data){
							this.heightValue = data.height;
							this.blockHash = data.hash;
							this.txNumber = data.txn;
							this.time = Tools.formatUtc(data.time);
						}
					}catch (e) {
						console.error(e)
					}
				})
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
                let url = `txs/blocks?pageNum=1&pageSize=100&height=${this.$route.params.height}`;
                const res = await HttpHelper.get(url);
                if(res && res.code === 0){
                    console.log(res)
                    this.transactionArray = res.data.data.map((item) => {
                        return {
                            txHash: item.tx_hash,
                            blockHeight: item.height,
                            txType: item.type,
                            from: item.from ? item.from : '--',
                            to: item.to ? item.to : '--',
                            signer: item.signer,
                            status:item.status === 1 ? 'Success' : 'Failed',
                            time: Tools.getDisplayDate(item.time)
                        }
                    })

                } else if(res.code){

                } else {

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
		color: #3264FD !important;
	}
	.block_detail_container{
		.block_detail_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.block_detail_header_content{
				margin: 0.3rem 0 0.1rem 0;
				text-align: left;
				padding-left: 0.2rem;
				.block_height_content{
					.information_value{
						font-size: 0.22rem;
						color: #787C99;
						margin: 0 0.07rem;
					}
					.flag_item_left {
						display: inline-block;
						font-size: 0.2rem;
						margin-right: 0.05rem;
						cursor: pointer;
						color: #3264FD !important;
					}
					.flag_item_left_disabled {
						display: inline-block;
						font-size: 0.2rem;
						margin-right: 0.05rem;
						cursor: pointer;
						color: #787C99;
					}
					.flag_item_right {
						display: inline-block;
						font-size: 0.2rem;
						margin-left: 0.05rem;
						color:#3264FD;
						cursor: pointer;
					}
					.flag_item_right_disabled {
						display: inline-block;
						font-size: 0.2rem;
						color: #787C99;
						margin-left: 0.05rem;
						cursor: pointer;
					}
				}
			}
			.block_detail_content{
				padding: 0.2rem;
				box-sizing: border-box;
				background: #fff;
				p{
					display: flex;
					margin-bottom: 0.16rem;
					span:nth-of-type(1){
						text-align: left;
						color: #787C99;
						font-size: 0.14rem;
						width: 1.5rem;
					}
					span:nth-of-type(2){
						text-align: left;
						color: #171D44;
						font-size: 0.14rem;
						flex: 1;
					}
				}
				p:last-child{
					margin-bottom: 0;
				}
			}
			.block_transaction_content{
				.block_transaction_title_content{
					font-size: 0.18rem;
					font-weight: bold;
					margin: 0.3rem 0 0.1rem 0;
					text-align: left;
					text-indent: 0.2rem;
				}
			}
		}
	}

</style>

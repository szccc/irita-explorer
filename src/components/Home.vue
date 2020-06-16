<template>
	<div class="home_container">
		<div class="home_content_wrap">
			<div class="home_content_header_content">
				<ul class="home_content_header_top_content">
					<li class="home_content_header_top_item_content">
						<p class="home_content_header_top_item_title"><i class="iconfont iconBlocks"></i>{{$t('ExplorerCN.home.blockHeight')}}</p>
						<p class="home_content_header_top_center_content"><router-link :to="`block/${block_height}`">{{block_height}}</router-link></p>
						<p class="home_content_header_top_footer_content"></p>
					</li>
					<li class="home_content_header_top_item_content">
						<p class="home_content_header_top_item_title"><i class="iconfont iconTransactions"></i>{{$t('ExplorerCN.home.transactions')}}</p>
						<p class="home_content_header_top_center_content"><router-link :to="`/txs`">{{transactionNumber}}</router-link></p>
						<p class="home_content_header_top_footer_content">{{transactionTime}}</p>
					</li>
					<li class="home_content_header_top_item_content">
						<p class="home_content_header_top_item_title"><i class="iconfont iconAvgBlockTime"></i>{{$t('ExplorerCN.home.avgBlockTime')}}</p>
						<p class="home_content_header_top_center_content">{{ageTime}}</p>
						<p class="home_content_header_top_footer_content">{{$t('ExplorerCN.home.last100Blocs')}}</p>
					</li>
				</ul>
				<ul class="home_content_header_bottom_content">
					<li class="home_content_header_bottom_item_content">
						<p class="home_content_header_bottom_title"><i class="iconfont iconVotingPower"></i>{{$t('ExplorerCN.home.validators')}}</p>
						<p class="home_content_header_bottom_footer">{{validatorNumber}}</p>
					</li>
					<li class="home_content_header_bottom_item_content">
						<p class="home_content_header_bottom_title"><i class="iconfont iconservice"></i>{{$t('ExplorerCN.home.services')}}</p>
						<p class="home_content_header_bottom_footer">
							<router-link v-if="serverNumber" :to="`/services`">{{serverNumber}}</router-link>
							<span v-else >--</span>
						</p>
					</li>
					<li class="home_content_header_bottom_item_content">
						<p class="home_content_header_bottom_title"><i class="iconfont iconAssets"></i>{{$t('ExplorerCN.home.assets')}}</p>
						<p class="home_content_header_bottom_footer"><router-link :to="`/nftAsset`">{{assetsNumber}}</router-link></p>
					</li>
				</ul>
			</div>
			<div class="home_block_and_transaction_content">
				<div class="home_block_content">
					<div class="home_block_top_content">
						<div class="home_block_top_title">
							<i class="iconfont iconBlocks"></i>
							<span>{{$t('ExplorerCN.home.blocks')}}</span>
						</div>
						<div class="home_block_view_all">
							<router-link :to="`/blocks`">{{$t('ExplorerCN.home.viewAll')}}</router-link>
						</div>
					</div>
					<ul class="home_block_bottom_content">
						<div v-for="item in latestBlockArray" :class="item.flShowTranslationalAnimation ? 'animation ' : '' ">
							<li class="home_block_list_item_content"
							    :class="item.showAnimation === 'show' ? 'fadeIn_animation' : '' ">
								<p class="home_block_time_content">
									<router-link  class="home_block" :to="`block/${item.height}`">{{item.height}}</router-link>
									<span class="home_age_time"> {{item.blockAgeTime}}</span>
								</p>
								<p class="home_tx_time_content">
									<span class="home_tx">Txn: <span>{{item.txNumber}}</span></span>
									<span class="home_time">{{item.time}}</span>
								</p>
							</li>
						</div>
					
					</ul>
				</div>
				<div class="home_transaction_content">
					<div class="home_transaction_top_content">
						<div class="home_transaction_top_title">
							<i class="iconfont iconTransactions"></i>
							<span>{{$t('ExplorerCN.home.listTransactions')}}</span>
						</div>
						<div class="home_transaction_view_all">
							<router-link :to="`/txs`">{{$t('ExplorerCN.home.viewAll')}}</router-link>
						</div>
					</div>
					<ul class="home_transaction_bottom_content">
						<li class="home_transaction_list_item_content" v-for="item in latestTransaction">
							<p class="home_transaction_time_content">
								<span class="home_transaction" >
									TX#<router-link :to="`/tx?txHash=${item.hash}`">{{`${item.hash.substr(0,16)}...`}}</router-link>
								</span>
								<span class="home_age_time">{{item.txAgeTime}}</span>
							</p>
							<p class="home_tx_type_content">
								<span class="home_tx_type">{{item.txType}}</span>
								<span class="home_tx_time">{{item.time}}</span>
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Server from "../service"
	import Tools from "../util/Tools"
    import { HttpHelper } from '../helper/httpHelper';
	export default {
		name: "Home",
		data () {
			return {
				block_height: 0,
				transactionNumber: 0,
				transactionTime:"",
				ageTime:"",
				validatorNumber: 0,
				userNumber: 0,
				assetsNumber: 0,
				serverNumber:0,
				syncTimer:null,
				latestBlockArray:[],
				latestTransaction:[],
				blocksTimer: null,
				transfersTimer:null,
			}
		},
		mounted () {
			this.getNavigation();
			this.getLastBlocks();
			this.getTransaction();
			clearInterval(this.syncTimer )
			this.syncTimer = setInterval(() => {
				this.getNavigation();
				this.getLastBlocks();
				this.getTransaction();
			},5000)
		},
		watch:{
			latestBlockArray(latestBlockArray){
				setTimeout( () => {
					latestBlockArray.forEach( item => {
						if(item.showAnimation){
							item.showAnimation = " "
						}
					})
				},1000)
			}
		},
		methods:{
			getNavigation(){
				Server.commonInterface({statistics:{}},(data) => {
					try {
						if(data){
							this.block_height = data.blockHeight;
							this.transactionNumber = data.txCount;
							this.validatorNumber = data.validatorCount;
							this.transactionTime = Tools.formatUtc(data.latestBlockTime);
							this.ageTime = data.avgBlockTime;
							this.assetsNumber = data.assetCount;
							this.serverNumber = data.serviceCount;
						}
					}catch (e) {
					
					}
				})
			},
			getLastBlocks(){
				Server.commonInterface({blockList:{pageNum: 1,pageSize: 10}} ,(data) => {
					try {
						if(data && data.data && data.data.length){
							let blocks = data.data;
							this.showBlockFadeinAnimation(blocks);
							let that = this;
							setTimeout( ()=> {
								that.latestBlockArray.map(item => {
									return item.flShowTranslationalAnimation = false
								})
							},1000);
							localStorage.setItem("lastBlockHeight",blocks[0].height);
							this.latestBlockArray = blocks.map(item => {
								return {
									flShowTranslationalAnimation :  item.flShowTranslationalAnimation ? item.flShowTranslationalAnimation : "",
									showAnimation: item.showAnimation ? item.showAnimation : "",
									height: item.height,
                                    time: Tools.getDisplayDate(item.time),
                                    Time: item.time,
									txNumber: item.txn,
									blockAgeTime: Tools.formatAge(Tools.getTimestamp(),item.time,"ago",">")
								}
							});
							clearInterval(this.blocksTimer)
							this.blocksTimer = setInterval( () => {
								that.latestBlockArray = that.latestBlockArray.map(item => {
									item.blockAgeTime = Tools.formatAge(Tools.getTimestamp(),item.Time,"ago",">");
									return item
								})
							},1000)
						}
						
					}catch (e) {
						console.error(e)
					}
				})
			},
			async getTransaction(){
                let url = `txs?pageNum=1&pageSize=10`;
                const res = await HttpHelper.get(url);
                if(res && res.code === 0){
                    console.log(this.transactionArray)
                    for (let txIndex = 0; txIndex < res.data.data.length; txIndex++){
                        if(res.data.data[txIndex].time > JSON.parse(localStorage.getItem("lastTxTime"))){
                            res.data.data[txIndex].showAnimation = "show";
                            res.data.data.forEach(item => {
                                item.flShowTranslationalAnimation = true
                            })
                        }
                    }
                    setTimeout(()=> {
                        this.latestTransaction.map(item => {
                            return item.flShowTranslationalAnimation = false
                        })
                    },1000);

                    localStorage.setItem('lastTxTime',JSON.stringify(Tools.getTimestamp()));
                    this.latestTransaction = res.data.data.map(item => {
                        return {
                            flShowTranslationalAnimtation :  item.flShowTranslationalAnimation ? item.flShowTranslationalAnimation : "",
                            showAnimation: item.showAnimation ? item.showAnimation : '',
                            hash: item.tx_hash,
                            time: Tools.getDisplayDate(item.time),
                            txType: item.type,
                            Time: item.time,
                            txAgeTime: Tools.formatAge(Tools.getTimestamp(),item.time,"ago",">")
                        }
                    });
                    clearInterval(this.transfersTimer);
                    this.transfersTimer = setInterval(()=> {
                        this.latestTransaction = this.latestTransaction.map(item => {
                            item.txAgeTime = Tools.formatAge(Tools.getTimestamp(),item.Time,"ago",">");
                            return item
                        })
                    },1000)
                } else if(res.code){

                } else {

                }
			},
			showBlockFadeinAnimation (blockList) {
				let storedLastBlockHeight = localStorage.getItem('lastBlockHeight') ? localStorage.getItem('lastBlockHeight') : '';
				if(storedLastBlockHeight){
					for(let index = 0; index < blockList.length; index++){
						if(blockList[index].height > storedLastBlockHeight){
							blockList.forEach(item => {
								item.flShowTranslationalAnimation = true
							});
							blockList[index].showAnimation = "show";
						}
					}
				}
			},
			componentAgeTime(startTime,endTime){
				return ((Number(new Date(startTime).getTime()) - Number(new Date(endTime).getTime())) /1000/ 100).toFixed(2)
			}
		},
		destroyed () {
			clearInterval(this.blocksTimer);
			clearInterval(this.transfersTimer);
			clearInterval(this.syncTimer )
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.home_container{
		.home_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.home_content_header_content{
				display: flex;
				flex-direction: column;
				.home_content_header_top_content{
					display: flex;
					justify-content: space-between;
					margin-top: 0.2rem;
					height: 1.3rem;
					.home_content_header_top_item_content{
						flex: 1;
						margin-right: 0.2rem;
						border-radius: 0.04rem;
						border: 0.01rem solid rgba(231,233,235,1);
						background: #fff;
						text-align: left;
						box-sizing: border-box;
						padding: 0.14rem;
						font-size: 0.14rem;
						i{
							color: #3264FD;
							margin-right: 0.1rem;
						}
						.home_content_header_top_center_content{
							font-size: 0.2rem;
							margin-top: 0.35rem;
						}
						.home_content_header_top_footer_content{
							font-size: 0.1rem;
							color:#787C99;
							margin-top: 0.1rem;
						}
					}
					.home_content_header_top_item_content:last-child{
						margin-right: 0;
					}
				}
				.home_content_header_bottom_content{
					display: flex;
					justify-content: space-between;
					margin-top: 0.2rem;
					height: 1rem;
					.home_content_header_bottom_item_content{
						flex: 1;
						margin-right: 0.2rem;
						border: 0.01rem solid rgba(231,233,235,1);
						background: #fff;
						text-align: left;
						box-sizing: border-box;
						padding: 0.14rem;
						font-size: 0.14rem;
						i{
							color: #3264FD;
							margin-right: 0.1rem;
						}
						.home_content_header_bottom_footer{
							margin-top: 0.35rem;
							color:#171D44;
							font-size: 0.2rem;
							line-height: 0.23rem;
							a{
								color: #3264FD;
							}
						}
					}
					.home_content_header_bottom_item_content:last-child{
						margin-right: 0;
					}
				}
			}
			.home_block_and_transaction_content{
				display: flex;
				margin: 0.2rem 0 1rem 0;
				.home_block_content{
					flex: 1;
					margin-right: 0.2rem;
					box-sizing: border-box;
					padding: 0.27rem 0.25rem 0.18rem 0.25rem;
					background: #fff;
					.home_block_top_content{
						display: flex;
						justify-content: space-between;
						background: #fff;
						z-index: 2;
						.home_block_top_title{
							i{
								color: #787C99;
								margin-right: 0.1rem;
							}
							span{
								color: #171D44;
								font-size: 0.16rem;
								font-weight: bold;
							}
						}
						.home_block_view_all{
							a{
								color: #3264FD;
							}
							border-bottom: 0.01rem solid #3264FD;
							
						}
					}
					.home_block_bottom_content{
						margin-top: 0.24rem;
						border-top: 0.01rem solid #F3F5F6;
						font-size: 0.14rem;
						color: #787C99;
						.home_block_list_item_content{
							display: flex;
							flex-direction: column;
							padding: 0.15rem 0;
							border-bottom: 0.01rem solid #F3F5F6;
							.home_block_time_content{
								display: flex;
								justify-content: space-between;
								.home_block{
									a{
										color: #3264FD ;
									}
								}
							}
							.home_tx_time_content{
								margin-top: 0.07rem;
								display: flex;
								justify-content: space-between;
								.home_tx{
									span{
										color: #171D44;
									}
								}
							}
						}
						.animation{
							animation:translational_animation 1.1s infinite;
						}
					}
					
				}
				.home_transaction_content{
					flex: 1;
					box-sizing: border-box;
					padding: 0.27rem 0.25rem 0.18rem 0.25rem;
					background: #fff;
					.home_transaction_top_content{
						display: flex;
						justify-content: space-between;
						.home_transaction_top_title{
							i{
								color: #787C99;
								margin-right: 0.1rem;
							}
							span{
								color: #171D44;
								font-size: 0.16rem;
								font-weight: bold;
							}
						}
						.home_transaction_view_all{
							a{
								color: #3264FD;
							}
							border-bottom: 0.01rem solid #3264FD;
							
						}
					}
					.home_transaction_bottom_content{
						margin-top: 0.24rem;
						border-top: 0.01rem solid #F3F5F6;
						font-size: 0.14rem;
						color: #787C99;
						.home_transaction_list_item_content{
							display: flex;
							flex-direction: column;
							padding: 0.15rem 0;
							border-bottom: 0.01rem solid #F3F5F6;
							.home_transaction_time_content{
								display: flex;
								justify-content: space-between;
								.home_transaction{
									font-size: 0.14rem;
									color: #171D44;
									font-weight: bold;
									a{
										padding-left: 0.05rem;
										font-weight: lighter;
										color: #3264FD ;
									}
								}
							}
							.home_tx_type_content{
								margin-top: 0.07rem;
								display: flex;
								justify-content: space-between;
							}
						}
					}
				}
			}
		}
	}
	.fadeIn_animation{
		animation: fadeIn 1s 1 0s;
	}
	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes translational_animation{
		from{transform: translateY(-0.59rem);}
		to{transform: translateY(0)}
	}
</style>

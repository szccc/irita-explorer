<template>
	<div class="header_container" :style="`background-color:${prodConfig.nav.bgColor || ''}`">
		<div class="header_content">
			<div class="header_menu_content">
				<div class="header_logo_content" @click="logoClick">
					<img class="header_logo_content_icon" src="../../assets/logo.png" alt="">
					<div :style="`color:${prodConfig.nav.color || ''}`">
						<p>{{prodConfig.logo.title}}</p>
						<p>{{prodConfig.logo.subTitle}}</p>
					</div>
				</div>
				<div class="header_menu">
					<el-menu
							:default-active="activeIndex2"
							class="el-menu-demo"
							mode="horizontal"
							@select="handleSelect"
							:background-color ="prodConfig.nav.bgColor || '#3264FD'"
							:text-color="prodConfig.nav.color || '#CBD8FE'"
							:active-text-color="prodConfig.nav.activeTextColor || '#fff'">
						<el-menu-item v-for="(item,idx) in menuList" :index="String(idx+1)" :key="idx">
							<router-link :to="item.link">{{item.titel}}</router-link>
						</el-menu-item>
					</el-menu>
				</div>
				<div class="header_mobile_menu" @click="featureShow=!featureShow">
					<img class="menu_btn" src="../../assets/menu.png" >
				</div>
			</div>
			<div class="header_input_content" :style="`background-color:${prodConfig.nav.bgColor || ''}`" v-if="searchShow">
				<div class="search_input_container" :style="`background-color:${prodConfig.nav.bgColor || ''}`">
					<div class="search_input_wrap">
						<input type="text"
						       class="search_input"
						       :style="`color:${prodConfig.nav.color || ''}`"
						       :placeholder="$t('ExplorerCN.Navigation.searchPlaceHolder')"
						       v-model.trim="searchInputValue"
						       @keyup.enter="onInputChange">
						<span @click="getData(searchInputValue)" 
							  class="iconfont iconsousuo"
							  :style="`color:${prodConfig.nav.color || ''}`"></span>
					</div>
				</div>
			</div>
			<div class="use_feature_mobile"
                 v-if="featureShow">
                <div v-for="(item,idx) in menuList" 
                     class="header_content_feature"
                     :style="`color:${prodConfig.nav.color || ''}`"
                     @click="mobileMenuDidClick(item,idx)" >
                	{{item.titel}}
                </div>
            </div>
		</div>
	</div>
</template>
<script>
	import Tools from "../../util/Tools";
	import {addrPrefix} from "../../constant";
	import prodConfig from "../../productionConfig";
	import { getBlockWithHeight,getTxDetail,getAddressTxList } from '../../service/api';
	export default {
		data() {
			return {
				prodConfig,
				activeIndex: '1',
				activeIndex2: '0',
				searchInputValue: '',
				featureShow:false,
				menuList:[],
				searchShow:false,
			};
		},
		beforeMount(){
			let funcs = {
				'100':{
					titel:this.$t('ExplorerCN.Navigation.block'),
					link:'/blocks',
				},
				'101':{
					titel:this.$t('ExplorerCN.Navigation.transactions'),
					link:'/txs',
				},
				'102':{
					titel:this.$t('ExplorerCN.Navigation.validators'),
					link:'/validators',
				},
				'103':{
					titel:this.$t('ExplorerCN.Navigation.nftAsset'),
					link:'/nftAsset',
				},
				'104':{
					titel:this.$t('ExplorerCN.Navigation.service'),
					link:'/services',
				}
			};
			if (prodConfig.navFuncList && prodConfig.navFuncList.length) {
				prodConfig.navFuncList.forEach((item)=>{
					if (funcs[item]) {
						this.menuList.push(funcs[item]);
					}
					if (item == '105') {
						this.searchShow = true;
					}
				});
			}
		},
		mounted(){
			// this.$Crypto.getCrypto('iris', 'testnet');
            this.setActiveIndex();
		},
        watch: {
            $route: {
                handler(val){
                    this.setActiveIndex(val.path);
                },
                deep: true
            }
        },
		methods: {
			handleSelect(key, keyPath) {
			},
			onInputChange () {
				this.getData()
			},
			logoClick(){
				this.$router.push(`/home`);
			},
            setActiveIndex(hash = window.location.hash){
			    if(this.menuList.every((m)=>!hash.includes(m.link))){
                    this.activeIndex2 = '';
                }else{
                    this.menuList.forEach((m, i)=>{
                        if(hash.includes(m.link)){
                            this.activeIndex2 = String(i+1);
                        }
                    })
                }
            },
			clearSearchContent () {
				this.searchInputValue = '';
			},
			mobileMenuDidClick(item,index){
				this.$router.push(item.link)
				this.activeIndex2 = String(index+1);
				this.featureShow = false;

			},
			getData(){
				if (Tools.removeAllSpace(this.searchInputValue) === '') {
					this.clearSearchContent();
					return
				} else {
					if (/^[A-F0-9]{64}$/.test(this.searchInputValue)) {
						this.searchTx();
					} else if (Tools.isBech32(this.searchInputValue)) {
						this.searchDelegator();
					} else if (/^\+?[1-9][0-9]*$/.test(this.searchInputValue)) {
						this.searchBlock();
					} else {
						this.toSearchResultPage();
					}
				}
			},
			async searchBlock(){
				try {
						let blockData = await getBlockWithHeight(this.searchInputValue)
						if(blockData&&blockData.height){
							this.$router.push(`/block/${this.searchInputValue}`);
							this.clearSearchContent();
						}else {
							this.toSearchResultPage();
						}
					}catch (e) {
						console.error(e)
						this.toSearchResultPage();
					}
			},
			async searchDelegator () {
                try {
                    const res = await getAddressTxList(this.searchInputValue,'','', 1, 10);
                    if(res){
                        this.$router.push(`/address/${this.searchInputValue}`);
                        this.clearSearchContent();
                    }else{
                        this.toSearchResultPage();
                    }

                }catch (e) {
                    console.error(e);
                    this.toSearchResultPage();
                }
			},
			async searchTx () {
			    try {
                    const res = await getTxDetail(this.searchInputValue);
                    if(res){
                        this.$router.push(`/tx?txHash=${this.searchInputValue}`);
                        this.clearSearchContent();
                    }else{
                        this.toSearchResultPage();
                    }

                }catch (e) {
                    console.error(e);
                    this.toSearchResultPage();
                }
			},
			toSearchResultPage () {
				this.$router.push(`/searchResult?${this.searchInputValue}`);
				this.searchInputValue = "";
			},
		}
	}
</script>

<style scoped lang="scss">
	.header_container{
		background: $bg_main_c;
		position: fixed;
		top:0;
		width: 100%;
		z-index: 10;

		.header_content{
			max-width: 12rem;
			margin: 0 auto;
			padding:0 0.15rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header_menu_content{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.header_logo_content{
					display:flex;
					align-items:center;
					cursor: pointer;
					margin-right: 0.2rem;
					height:0.6rem;
					font-size:$s12;
					font-family:PingFangSC-Regular,PingFang SC;
					color:$t_white_c;
					text-align: left;
					line-height:1.3;
					.header_logo_content_icon{
						height: 0.3rem;
						width: 0.28rem;
						margin-right:0.12rem;
					}
					.header_logo_content_title{
						
					}
					.header_logo_content_subTitle{
						
					}
				}
				
				.header_menu{
					display:block;
					.el-menu-demo{
						width: 100%;
						background: $bg_main_c;
						.el-menu-item{
							a{
								display: inline-block;
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				.header_mobile_menu{
					display:none;
					.menu_btn {
		                width: 0.25rem;
		                height: 0.25rem;
		                top: 0.26rem;
		                right: 0.1rem;
		                img {
		                    width: 100%;
		                }
		            }
				}
			}
			
		}
		.header_input_content{
			flex: 1;
			background: $bg_main_c;
			.search_input_container {
				flex: 1;
				background: $bg_main_c;
				z-index: 1;
				.search_input_wrap {
					max-width: 12.8rem;
					margin: 0 auto;
					display: flex;
					align-items: center;
					border: 0.01rem solid $t_fourth_c;
					border-radius: 0.06rem;
					input {
						width: 100%;
						height: 0.3rem;
						background: transparent;
						border: 0.01rem solid transparent;
						color: $t_white_c;
						font-size: $s14;
						text-indent: 0.1rem;
					}
					input::placeholder{
						font-size: $s14;
						color: $t_fourth_c;
					}
					span {
						right: 0.3rem;
						height:0.3rem;
						font-size: $s20;
						padding: 0 0.1rem;
						line-height: 0.3rem;
						color: $t_fourth_c;
						cursor: pointer;
					}
				}
			}
		}
		.use_feature_mobile{
			display:none;
			width:100%;
			margin-top:0.1rem;
			.header_content_feature{
				cursor: pointer;
				padding:0.05rem 0;
		        color: $t_white_c;
		        font-size: $s16;
		        font-weight: bold;
		        text-align:left;
			}
		}
	}

	@media screen and (max-width: 1000px) {
		.header_container{
			position: static;
			.header_content{
				padding:0.1rem 0.15rem;
				flex-direction:column;
				.header_menu_content{
					width:100%;
					
					.header_menu{
						display:none;
					}
					.header_mobile_menu{
						display:block;
					}
				}
				
			}
			.header_input_content{
				width:100%;
				.search_input_container {
					margin-top:0.05rem;
				}
			}
			.use_feature_mobile{
				display:block;
			}
		}
	}

	@media screen and (max-width: 768px) {
		
	}

	@media screen and (max-width: 375px) {
		
	}


	
</style>

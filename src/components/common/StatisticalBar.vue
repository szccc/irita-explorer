<template>
  <div class="statistical_bar_container">
      <div class="statistical_bar_wrap">
        <div class="statistical_validator_content">
            <div class="statistical_validator_top_content">
                <p class="statistical_validator_header">
                    <span class="iconfont iconBlocks"></span>
                    <span class="statistical_validator_header_label">{{$t('ExplorerLang.home.blockHeight')}}</span>
                </p>
                <p class="statistical_current_block skip_route">
                    <router-link :to="`/block/${currentBlockHeight}`">{{currentBlockHeight}}</router-link>
                </p>
            </div>
            <div class="statistical_validator_bottom_content">
                <div class="statistical_img_content">
                    <router-link :to="Tools.addressRoute(proposerAddress)">
                        <div class="statistical_validator_header_img_content">
                            <span >{{validatorHeaderImgSrc}}</span>
                            <img v-show="validatorHeaderImgHref" :src="validatorHeaderImgHref"  @error="imgLoadError()">
                        </div>
                    </router-link>
                </div>
                <p class="statistical_moniker_content skip_route">
                    <router-link :to="Tools.addressRoute(proposerAddress)">{{moniker}}</router-link>
                </p>
            </div>
        </div>
        <div class="statistical_bar_content">
            <ul class="statistical_list_content" :class="lineNum">
                <li class="statistical_item_content" v-for="(item,index) in navigationArray" :key="index">
                    <p class="statistical_header_content">
                        <i :class="item.iconClass"></i>
                        <span class="statistical_content">{{item.label}}</span>
                    </p>
                    <p class="statistical_center_content">
                        <router-link v-if="item.to" :to="item.to">{{item.value}}</router-link>
                        <span v-else>{{item.value}}</span>
                    </p>
                    <p class="statistical_footer_content">
                        {{item.footerLabel}}
                    </p>
                </li>
            </ul>
        </div>
      </div>
  </div>
</template>

<script>
import prodConfig from "../../productionConfig"
import { getStatistics } from "../../service/api";
import Tools from "../../util/Tools";
export default {
  name: 'StatisticalBar',
  data () {
    return {
        Tools,
        navigationObj:{
            201: {
                id:201,
                iconClass:'iconfont iconTransactions',
                label: this.$t('ExplorerLang.home.transactions'),
                footerLabel:'',
                value:'--',
                to: '/txs',
            },
            202: {
                id:202,
                iconClass:'iconfont iconBlocks',
                label: this.$t('ExplorerLang.home.validators'),
                footerLabel:'',
                value:'--',
                to: '/validators',
            },
            203: {
                id:203,
                iconClass:'iconfont iconAvgBlockTime',
                label: this.$t('ExplorerLang.home.avgBlockTime'),
                footerLabel:this.$t('ExplorerLang.home.last100Blocs'),
                value:'--',
                to: '',
            },
            204: {
                id:204,
                iconClass:'iconfont iconAssets',
                label: this.$t('ExplorerLang.home.assets'),
                footerLabel:'',
                value:'--',
                to: '/nftAsset',
            },
            205: {
                id:205,
                iconClass:'iconfont iconshujuleibie',
                label: this.$t('ExplorerLang.home.denoms'),
                footerLabel:'',
                value:'--',
                to: '/denoms',
            },
            206:{
                id:206,
                iconClass:'iconfont iconservice',
                label: this.$t('ExplorerLang.home.services'),
                footerLabel:'',
                value:'--',
                to: '/services',
            },
            207:{
                id:207,
                iconClass:'iconfont iconID',
                label: this.$t('ExplorerLang.home.identities'),
                footerLabel:'',
                value:'--',
                to: '/identities',
            },
            208:{
                id:208,
                iconClass:'iconfont iconVotingPower',
                label: this.$t('ExplorerLang.home.validatorNumCount'),
                footerLabel:'',
                value:'--',
                to: '/staking',
            },
            209:{
                id:209,
                iconClass:'iconfont iconBondedTokens',
                label: this.$t('ExplorerLang.home.bondedTokens'),
                footerLabel:'',
                value:'--',
                to: '',
            },
        },
        navigationArray:[],
        syncTimer: null,
        currentBlockHeight:0,
        validatorHeaderImgSrc:'',
        validatorHeaderImgHref:'',
        moniker:'',
        proposerAddress:'',
        monikerStringLength:8
    }
  },
  computed: {
      lineNum() {
          prodConfig.homeCard = prodConfig.homeCard.filter( item => {
              return item !== 200
          })
          let num = prodConfig.homeCard.length
          if(num <= 4) {
              return ''
          } else if ( num <= 6) {
              return 'lineThree'
          } else if ( num <= 8) {
              return 'lineFour'
          } else {
               return 'lineFive'
          }
      }
  },
  watch: {},
  created () {
  },
  mounted () {
        this.getNavigation();
        clearInterval(this.syncTimer )
        this.syncTimer = setInterval(() => {
            this.getNavigation();
        },5000)
  },
  methods: {
        async getNavigation(){
            try{
                let statistics = await getStatistics();
                if(statistics){
                    this.validatorHeaderImgHref = ''
                    //先通过正则剔除符号空格及表情，只保留数字字母汉字
                    let regex =  /[^\w\u4e00-\u9fa50-9a-zA-Z]/g;
                    let replaceMoniker = statistics.moniker.replace(regex,'');
                    this.validatorHeaderImgHref = statistics.validator_icon ? statistics.validator_icon : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg');
                    this.validatorHeaderImgSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : '';
                    this.moniker = Tools.formatString(statistics.moniker,this.monikerStringLength,'...');
                    this.proposerAddress = statistics.operator_addr;
                    this.currentBlockHeight = statistics.blockHeight;
                    this.navigationArray=[]
                    prodConfig.homeCard.forEach(item => {
                        if(item === 200) return
                        let itemObj = this.navigationObj[item]
                        switch(item) {
                            case 201:
                                itemObj.value = statistics.txCount;
                                itemObj.footerLabel = Tools.getDisplayDate(statistics.latestBlockTime) 
                                break;                        
                            case 202:
                                itemObj.value = statistics.validatorCount;
                                break;
                            case 203:
                                itemObj.value = `${statistics.avgBlockTime} ${this.$t('ExplorerLang.unit.second')}`
                                break;
                            case 204:
                                itemObj.value = statistics.assetCount
                                break;
                            case 205:
                                itemObj.value = statistics.serviceCount
                                break;
                            case 206:
                                itemObj.value = statistics.denomCount
                                break;
                            case 207:
                                itemObj.value = statistics.identityCount
                                break;
                            case 208:
                                itemObj.value = statistics.validatorNumCount
                                break;
                            case 209:
                                itemObj.value = Tools.formatPercentage(statistics.bonded_tokens,statistics.total_supply)
                                itemObj.footerLabel = Tools.formatBondedTokens(statistics.bonded_tokens,statistics.total_supply)
                                break;
                        }
                        this.navigationArray.push(itemObj)
                    })
                }
            }catch(err){
                console.error(err);
            }
        },
        imgLoadError(){
			this.validatorHeaderImgHref = ""
		},
  },
  destroyed () {
        clearInterval(this.syncTimer)
  }
}
</script>

<style lang="scss" scoped>
    a {
		color: $t_link_c !important;
	}
    .statistical_bar_container {
        width: 100%;
        max-width: 12rem;
		margin: 0.2rem auto 0 auto;
        .statistical_bar_wrap{
            box-sizing: border-box;
            padding: .2rem;
            background: $bg_white_c;
            display: grid;
            grid-template-columns: 27.4% 72.6%;
            border: .01rem solid $bd_second_c;
            .statistical_validator_content{
                display: flex;
                flex-direction: column;
                align-items: center;
                .statistical_validator_top_content{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .statistical_validator_header{
                        margin-bottom: 0.2rem;
                        margin-top: 0.15rem;
                        .iconBlocks{
                            color: $theme_c;
                            margin-right: 0.08rem;
                        }
                        .statistical_validator_header_label{
                            color:$t_second_c;
                            font-size: $s14;
                            line-height: 0.16rem;
                        }
                    }
                    .statistical_current_block{
                        margin-bottom: 0.2rem;
                        a{
                            font-size: $s20;
                        }
                        font-weight: bold;
                    }
                }
                .statistical_validator_bottom_content{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .statistical_img_content{
                        width: 1.2rem;
                        height: 1.19rem;
                        margin-bottom: 0.27rem;
                        .statistical_validator_header_img_content{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            background: $bg_avatar;
                            overflow: hidden;
                            position: relative;
                            img{
                                position: absolute;
                                width: 100%;
                            }
                            span{
                                font-size: $s52;
                            }
                        }
                    }
                }
            }
            .statistical_bar_content {
                    .statistical_list_content{
                        // margin-top: 0.2rem;
                        display: grid;
                        grid-template-columns: repeat(2,1fr);
                        grid-template-rows: repeat(2,1.33rem);
                        grid-gap:0.2rem 0.2rem;
                        .statistical_item_content{
                            border-radius: 0.04rem;
                            border: 0.01rem solid $bd_second_c;
                            background: $bg_white_c;
                            text-align: left;
                            box-sizing: border-box;
                            padding: 0.14rem;
                            font-size: $s14;
                            i{
                                color: $theme_c;
                                margin-right: 0.1rem;
                            }
                            .statistical_center_content{
                                font-size: $s20;
                                margin-top: 0.35rem;
                            }
                            .statistical_footer_content{
                                font-size: $s10;
                                color: $t_second_c;
                                margin-top: 0.1rem;
                            }
                        }
                    }
                    .lineThree {
                        grid-template-columns: repeat(3,1fr);
                    }
                    .lineFour {
                        grid-template-columns: repeat(4,1fr);
                    }
                    .lineFive {
                        grid-template-columns: repeat(5,1fr);
                    }
            }
        }
    }
    @media screen and (max-width: 1000px) {
        .statistical_bar_container {
            .statistical_bar_wrap{
                margin: 0;
                padding: 0.1rem;
                grid-template-columns: repeat(1,auto);
                .statistical_validator_content{
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    
                    .statistical_validator_top_content{
                        .statistical_validator_header{
                            margin-bottom: 0.15rem;
                        }
                    }
                    .statistical_validator_bottom_content{
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        .statistical_img_content{
                            width: 0.3rem;
                            height: 0.3rem;
                            border-radius: 0.15rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 0.07rem;
                            a{
                                width: 100%;
                                height: 100%;
                                .statistical_validator_header_img_content{
                                    span{
                                        font-size: $s10;
                                    }
                                }
                            }
                        }
                    }
                }
                .statistical_bar_content {
                    .statistical_list_content{
                        grid-template-columns: repeat(1,1fr);
                        grid-template-rows: 1.1rem;
                        grid-gap: 0.1rem 0rem;
                        .statistical_item_content{
                            .statistical_center_content{
                                margin-top: 0.2rem;
                            }
                        }
                    }
                }
            }
        }
	}
</style>

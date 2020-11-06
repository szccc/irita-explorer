<template>
  <div class="statistical_bar_container">
      <div class="statistical_bar_wrap">
        <div class="statistical_bar_content">
            <ul class="statistical_list_content" :class="lineNum">
                <li class="statistical_item_content" v-for="(item,index) in navigationArray" :key="index">
                    <p class="statistical_header_content">
                        <i :class="item.iconClass"></i>
                        <span class="statistical_content">{{item.label}}</span>
                    </p>
                    <p class="statistical_center_content">
                        <router-link v-if="item.isLink" :to="item.to">{{item.value}}</router-link>
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
        navigationObj:{
           200: {
                id:200,
                iconClass:'iconfont iconBlocks',
                label: this.$t('ExplorerLang.home.blockHeight'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '',
            },
            201: {
                id:201,
                iconClass:'iconfont iconTransactions',
                label: this.$t('ExplorerLang.home.transactions'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '/txs',
            },
            202: {
                id:202,
                iconClass:'iconfont iconBlocks',
                label: this.$t('ExplorerLang.home.validators'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '/validators',
            },
            203: {
                id:203,
                iconClass:'iconfont iconAvgBlockTime',
                label: this.$t('ExplorerLang.home.avgBlockTime'),
                footerLabel:this.$t('ExplorerLang.home.last100Blocs'),
                value:'--',
                isLink: false,
                to: '',
            },
            204: {
                id:204,
                iconClass:'iconfont iconAssets',
                label: this.$t('ExplorerLang.home.assets'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '/nftAsset',
            },
            205: {
                id:205,
                iconClass:'iconfont iconshujuleibie',
                label: this.$t('ExplorerLang.home.denoms'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '/denoms',
            },
            206:{
                id:206,
                iconClass:'iconfont iconservice',
                label: this.$t('ExplorerLang.home.services'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '/services',
            },
            207:{
                id:207,
                iconClass:'iconfont iconID',
                label: this.$t('ExplorerLang.home.identities'),
                footerLabel:'',
                value:'--',
                isLink: true,
                to: '/identities',
            }
        },
        navigationArray:[],
        syncTimer: null,
    }
  },
  computed: {
      lineNum() {
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
                this.navigationArray=[]
                prodConfig.homeCard.forEach(item => {
                    let itemObj = this.navigationObj[item]
                    switch(item) {
                        case 200:
                            itemObj.value = statistics.blockHeight;
                            itemObj.to = `block/${statistics.blockHeight}`   
                            break;
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
                    }
                    this.navigationArray.push(itemObj)
                })
            }
        }catch(err){
            console.error(err);
        }
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
    .statistical_list_content{
        margin-top: 0.2rem;
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
    @media screen and (max-width: 1000px) {
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
</style>

<template>
    <div class="search_result_detail_wrap">
        <div class="search_result_title_wrap">
            <div class="search_result_title_content">
                <span>{{$t('ExplorerCN.searchResult.title')}}</span>
                <span>{{Object.keys(this.$route.query)[0]}}</span>
            </div>
            <div class="result_content_container">
                <div class="result_img">
                    <img src="../assets/resultless.png" alt="">
                </div>
                <p class="result_title">{{$t('ExplorerCN.searchResult.resultTitle')}}</p>
                <p class="try_info">{{$t('ExplorerCN.searchResult.searchTip')}}</p>
                <div class="back_home_btn" @click="backHome">
                    <span>{{$t('ExplorerCN.searchResult.backHome')}}</span>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>

	import Tools from '../util/Tools';
    import { TX_TYPE,TX_STATUS } from '../constant';
	export default {
		name: "searchResult",
		data() {
			return {
			     TX_TYPE,
                 TX_STATUS
			}
		},
		
		methods:{
			backHome(){
				this.$router.push("/home")
			},
		},
	}
</script>

<style lang="scss" scoped>
   .search_result_detail_wrap{
       .search_result_title_wrap{
           max-width: 12rem;
           margin: 0 auto;
           text-align: left;
           display: flex;
           flex-direction: column;
           .search_result_title_content{
               margin: 0.3rem 0 0.1rem 0;
               span:nth-of-type(1){
                   font-size: 0.18rem;
                   color: #22252A;
                   line-height: 0.21rem;
               }
               span:nth-of-type(2){
                   margin-left: 0.1rem;
                   font-size: 0.18rem;
                   color: #22252A;
                   line-height: 0.21rem;
               }
           
           }
           .result_content_container{
               margin-top: 2rem;
               flex: 1;
               height: 100%;
               display: flex;
               justify-content: center;
               align-items: center;
               flex-direction: column;
               .result_title{
                   margin-top: 0.2rem;
                   color: #000;
                   font-size: 0.18rem;
               }
               .try_info{
                   font-size: 0.14rem;
                   color: #787C99;
                   margin-bottom: 0.44rem ;
               }
               .back_home_btn{
                   text-align: center;
                   width: 1.58rem;
                   height: 0.36rem;
                   margin: 0 auto;
                   background: #3264FD;
                   border-radius: 0.05rem;
                   color: #fff;
                   font-size: 0.14rem;
                   line-height: 0.36rem;
                   cursor: pointer;
               }
           }
       }
   }
</style>

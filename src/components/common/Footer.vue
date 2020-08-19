<template>
	<div class="footer_container" 
	  	 :style="`color:${(prodConfig.footer || {}).color || 'rgba(255,255,255,0.5)'}`">
		<div class="footer_content_top"
			 v-if="logoImg.length"
		     :style="`background:${(prodConfig.footer || {}).bgColor_top || '#363A3D'}`">
			<img class="footer_content_top_icon" :src="logoImg" alt="">
		</div>
		<div class="footer_content_bottom" 
			 :style="`background:${(prodConfig.footer || {}).bgColor_bottom || '#000000'}`">
			<p>{{(prodConfig.footer || {}).copyright || 'copyright © 2020 边界智能'}}</p>
			<p>{{chainId}}</p>
			<p>{{version}}</p>
		</div>
	</div>
</template>

<script>
	import prodConfig from "../../productionConfig"
	import { getNodeInfo } from "../../service/api"
	export default {
		name: "Footer",
		data(){
			return {
				prodConfig,
				chainId:'',
				version:''
			};
		},
		computed:{
			logoImg(){
				let img = '';
				try {img = require('../../assets/footer_logo.png');}catch(e){}
				return img;
			}
		},
		mounted(){
			this.nodeInfo();
		},
		methods:{
			async nodeInfo(){
				let nodeInfo = await getNodeInfo();
				if (nodeInfo) {
					this.chainId = `Chain ID ${nodeInfo.node_info.network || '--'}`;
					this.version = `Node Version ${nodeInfo.application_version.version || '--'} | Tendermint Version ${nodeInfo.node_info.version || '--'}`;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.footer_container{
		.footer_content_top{
			display: flex;
			align-items:center;
			justify-content: flex-start;
			padding:0 3rem;
			font-size:$s14;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			.footer_content_top_icon{
				height:0.6rem;
				margin:0.48rem 0;
			}
		}

		.footer_content_bottom{
			display: flex;
			justify-content: space-between;
			align-items:center;
			padding:0.15rem 3rem;
			font-size:$s12;
			font-family:ArialMT;
			p {
				margin:0 0.15rem;
			}
		}
	}

	@media screen and (max-width: 1300px) {
		.footer_container{
			.footer_content_top{
				padding:0 1rem;
				.footer_content_top_icon{
					
				}
			}

			.footer_content_bottom{
				padding:0.15rem 1rem;
			}
		}
	}

	@media screen and (max-width: 768px) {
		.footer_container{
			.footer_content_top{
				padding:0 0.15rem;
				.footer_content_top_icon{
					
				}
			}

			.footer_content_bottom{
				padding:0.15rem;
			}
		}
	}

	@media screen and (max-width: 500px) {
		.footer_container{
			.footer_content_top{
				padding:0 0.15rem;
				.footer_content_top_icon{
					
				}
			}

			.footer_content_bottom{
				padding:0.15rem;
				flex-direction:column;
				p {
					margin:0.03rem;
				}
			}
		}
	}
</style>

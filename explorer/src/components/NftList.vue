<template>
	<div class="nft_list_container">
		<div class="nft_list_content_wrap">
			<div class="nft_list_header_content">
				<h3 class="nft_list_header_title">NFT Collections</h3>
			</div>
			<ul class="nft_denom_content">
				<li class="nft_denom_list_item" v-for="item in nftList" @click="showDenomInformation(item.item)"  :class="item.isActive ? 'hidden_footer_padding' : ''">
					<p class="nft_denom_title">
						<span>{{item.item}}</span>
						<span class="select_content" :class="item.isActive ? 'show_bottom_select' : ''" >
							<i class="iconfont iconxialaxuanzejiantou"></i>
						</span>
					</p>
					<div class="nft_denom_list_content"  v-show="item.isActive">
						<el-table :data="denomArray">
							<el-table-column label="ID">
								<template slot-scope="scope">
									<router-link :to="`/nft/token?denom=${item.item}&&tokenId=${scope.row.id}`">{{scope.row.id}}</router-link>
								</template>
							</el-table-column>
							<el-table-column label="Owner">
								<template slot-scope="scope">
									<router-link :to="`/address/${scope.row.owner}`">{{scope.row.owner}}</router-link>
								</template>
							</el-table-column>
							<el-table-column label="URI" prop="token_uri">
								<template slot-scope="scope">
									<a v-if="scope.row.token_uri" :download="scope.row.token_uri" :href="scope.row.token_uri" target="_blank">{{scope.row.token_uri}}</a>
									<span v-else>--</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Server from "../service"
	export default {
		name: "NftList",
		data () {
			return {
				nftList: null,
				denomArray:[]
			}
		},
		mounted(){
			this.getNftList()
		},
		methods:{
			getNftList(){
				Server.commonInterface({nftList:{}},(res) =>{
					try {
						if(res){
							this.nftList = res.map(item => {
								return {
									item: item,
									isActive: false
								}
							})
						}
					}catch (e) {
						console.error(e)
					}
				})
			},
			showDenomInformation(denom){
				Server.commonInterface({denomInformation:{
						denom: denom
					}},(result) => {
					try {
						if(result && result.data){
							this.denomArray = []
							for(let item in result.data[denom].nfts){
								this.denomArray.push(result.data[denom].nfts[item]);
							}
							if(this.nftList)
							this.nftList = this.nftList.map((item) => {
								if(item.item === denom){
									item.isActive = !item.isActive;
								}else {
									item.isActive = false;
								}
								return item
							})
						}
					}catch (e) {
						console.error(e)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: #3264FD !important;
	}
	.nft_list_container{
		.nft_list_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			width: 100%;
			.nft_list_header_content{
				width: 100%;
				margin: 0.3rem 0 0 0;
				.nft_list_header_title{
					font-size: 0.18rem;
					color: #22252A;
					line-height: 0.21rem;
					text-align: left;
					text-indent: 0.2rem;
				}
				.nft_denom_content{
					margin-top: 0.1rem;
					width: 100%;
					height:0.5rem;
					line-height: 0.5rem;
					font-size: 0.14rem;
					color:#787C99;
					text-align: left;
					background: #fff;
					text-indent: 0.2rem;
				}
			}
			.nft_denom_content{
				width: 100%;
				.nft_denom_list_item{
					width: 100%;
					text-align: left;
					background: #fff;
					text-indent: 0.2rem;
					margin-top: 0.1rem;
					padding: 0.2rem 0;
					.nft_denom_title{
						display: flex;
						justify-content: space-between;
						align-items: center;
						box-sizing: border-box;
						padding-right: 0.2rem;
						.select_content{
							padding-top: 0.1rem;
							transform: rotate(-90deg);
							i{
								padding-right: 0.08rem;
							}
						}
						.show_bottom_select{
							transform: rotate(0deg);
						}
					}
				}
				.nft_denom_list_content{
					box-sizing: border-box;
					padding: 0.2rem;
					margin-top: 0.4rem;
					/deep/ .el-table th {
						background: #fafaff !important;
					}
					/deep/ .el-table tr {
						background: #fafaff !important;
					}
				}
				.hidden_footer_padding{
					padding-bottom: 0;
				}
			}
			
		}
	}
</style>

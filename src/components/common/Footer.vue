<template>
	<div class="footer_container">
		<div class="footer_content">
			<span>© CSChainplorer 2020 all rights reserved</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Footer"
	}
</script>

<style scoped lang="scss">
	.footer_container{
		border-top: 0.01rem solid $bd_second_c;
		display: flex;
		justify-content: center;
		.footer_content{
			padding: 0.15rem 0;
			font-size: $s12;
			color: $t_third_c;
			line-height: 0.14rem;
		}
	}

</style>

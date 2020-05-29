<template>
	<div class="footer_container">
		<div class="footer_content">
			<span>© csrbplorer 2020 all rights reserved</span>
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
		border-top: 0.01rem solid #E7E9EB;
		display: flex;
		justify-content: center;
		.footer_content{
			padding: 0.15rem 0;
			font-size: 0.12rem;
			color: #C0C4CC;
			line-height: 0.14rem;
		}
	}

</style>

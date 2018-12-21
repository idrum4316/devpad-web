<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app',
		created () {
			this.$store.commit('init')
		}
	}
</script>

<style>
	@import './assets/css/theme.min.css';
	@import './assets/css/styles.css';
</style>
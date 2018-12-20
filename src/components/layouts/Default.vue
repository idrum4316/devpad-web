<template>
	<div>

		<top-nav></top-nav>
		<router-view></router-view>
		<bottom-footer></bottom-footer>

	</div>
</template>

<script>
	import TopNav from '../elements/TopNav.vue'
	import BottomFooter from '../elements/BottomFooter.vue'

	export default {
		name: 'DefaultLayout',
		components: { TopNav, BottomFooter },
		data () {
			return {}
		},
		events: {
			unauthorized () {
				this.logout()
			}
		},
		created () {
			this.$bus.$on('logout', this.logout);
		},
		beforeDestroy() {
			this.$bus.$off('logout');
		},
		methods: {
			logout () {
				localStorage.removeItem('jwt')
				this.$router.push({ name: 'Login' })
			}
		}
	}
</script>
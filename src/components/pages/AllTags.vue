<template>
	<default-layout>
		<div>
			<section class="hero is-light">
				<div class="hero-body">
					<div class="container">
						<div class="field">
							<div class="control is-expanded has-icons-left">
								<input class="input" type="text" placeholder="Filter Tags" v-model="filter">
								<span class="icon is-small is-left">
									<font-awesome-icon :icon="['fa', 'filter']" />
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="section">
				<div class="container">

					<!-- Loading Icon -->
					<div v-if="loading">
						<loader></loader>
					</div>

					<div v-else>
						<div class="columns is-multiline is-mobile">
							<div class="column" v-for="tag in filteredTags" :key="tag.term">
								<div class="card">
									<div class="card-content">
										<router-link :to="{ name: 'Search', query: { tag: tag.term }}" class="no-wrap">
											{{ tag.term }} ({{ tag.count }})
										</router-link>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</section>
		</div>
	</default-layout>
</template>

<script>
	import DefaultLayout from '../layouts/default.vue'
	import Loader from '../elements/Loader.vue'

	export default {
		name: 'AllTags',
		components: { DefaultLayout, Loader },
		data () {
			return {
				tags: [],
				loading: true,
				filter: ''
			}
		},
		computed: {
			filteredTags () {
				var vm = this
				return this.tags.filter(tag => tag.term.includes(vm.filter))
			}
		},
		created () {
			window.document.title = 'All Tags'
			this.fetchData()
		},
		watch: {
			$route: 'fetchData' // call again the method if the route changes
		},
		methods: {
			// Fetch the page contents from the api
			fetchData () {
				var vm = this

				this.$axios.get('/api/tags')
					.then(function (response) {
						vm.loading = false
						vm.tags = response.data.facets.tags.terms
					})
					.catch(function (error) {
						vm.loading = false
						console.log(error.message)
					})
				// end Axios GET

			} // end fetchData
		}
	}
</script>
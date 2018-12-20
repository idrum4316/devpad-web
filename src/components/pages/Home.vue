<template>
	<div>
		<section class="section">
			<div class="container">

				<div v-if="loading">
					<loader></loader>
				</div>

				<div v-else class="columns">
					<div class="column">
						<div class="panel">
							<div class="panel-heading">
								Latest Pages
							</div>
							<div v-for="page in pages" :key="page.id">
								<router-link :to="{ name: 'ViewPage', params: { slug: page.id } }" class="panel-block">
									<span class="panel-icon">
										<font-awesome-icon :icon="['fa', 'file']" fixed-width />
									</span>
									{{ page.fields['metadata.title'] || page.id }}
								</router-link>
							</div>
						</div>
					</div>

					<div class="column">
						<div class="panel">
							<div class="panel-heading">
								Popular Tags
							</div>
							<div v-if="tags.total > 0">
								<div v-for="tag in tags.terms.slice(0, 10)" :key="tag.term">
									<router-link :to="{ name: 'Search', query: { tag: tag.term } }" class="panel-block">
										<span class="panel-icon">
											<font-awesome-icon :icon="['fa', 'tag']" fixed-width />
										</span>
										{{ tag.term }}
									</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import Loader from '../elements/Loader.vue'

	export default {
		name: 'Home',
		components: { Loader },
		data () {
			return {
				loading: true,
				pages: [],
				tags: [],
				totalPages: undefined,
				error: false
			}
		},
		created () {
			window.document.title = 'Home'
			this.fetchData()
		},
		methods: {
			// Fetch the page contents from the api
			fetchData () {
				var vm = this
				vm.loading = true

				this.$axios.get('/api/search?sort=-modified', {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					vm.pages = response.data.hits
					vm.tags = response.data.facets.tags
					vm.totalPages = response.data.total_hits
					vm.loading = false
				})
				.catch(function (error) {
					vm.error = true
					vm.loading = false
					console.log(error.message)
					if (error.response) {
						if (error.response.status === 401) {
							vm.$bus.$emit('logout')
						}
					}
				})
				// end Axios GET

			}, // end fetchData
		}
	}
</script>
<template>
	<default-layout>
		<div>
			<section class="hero is-light">
				<div class="hero-body">
					<div class="container">
						<form v-on:submit.prevent="query.page = 1; refresh()">
							<div class="field has-addons">
								<div class="control is-expanded has-icons-left">
									<input class="input" type="text" placeholder="Search Query" v-model="query.q">
									<span class="icon is-small is-left">
										<font-awesome-icon :icon="['fa', 'search']" />
									</span>
								</div>
								<div class="control">
									<button type="submit" class="button is-info">
										Search
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</section>

			<section class="section">
				<div class="container">

					<div v-if="loading">
						<loader></loader>
					</div>

					<div class="columns" v-else>

						<div class="column is-one-quarter is-hidden-mobile">
							<nav class="panel" v-if="facets.tags">
								<p class="panel-heading">
									Tag
								</p>
								<div class="panel-block" v-for="tag in facets.tags.terms" :key="tag.term">
									<input type="checkbox" :value="tag.term" v-model="query.tag" @change="query.page = 1; refresh()">
									{{ tag.term }} - {{ tag.count }}
								</div>

								<div class="panel-block" v-if="query.tag.length > 0">
									<button class="button is-link is-outlined is-fullwidth" @click="query.tag = []; refresh()">
										clear
									</button>
								</div>
							</nav>
						</div>

						<div class="column">
							<div class="title">Results</div>
							<div class="subtitle">{{ startsAt }} - {{ endsAt }} of {{ totalHits }}</div>

							<!-- No Results Warning -->
							<article class="notification is-warning" v-if="totalHits === 0">
								<div class="subtitle">
									<font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
									No Results Found!
								</div>
								<p>
									Modify your search and try again
								</p>
							</article>

							<!-- Search Hits -->
							<div class="card" style="margin-bottom: 1rem;" v-for="hit in hits" :key="hit.id">
								<div class="card-content">
									<router-link class="subtitle is-5 has-text-primary" :to="{ name: 'ViewPage', params: { slug: hit.id }}">
										<font-awesome-icon :icon="['fa', 'file-alt']" /> {{ hit.fields.title || hit.id }}
									</router-link>

									<br>

									<div v-if="hit.fragments">
										<p v-if="hit.fragments.contents" v-for="fragment in hit.fragments.contents" v-html="fragment" :key="fragment.id"></p>
									</div>

									<br>

									<!-- Page Meta Info -->
									<div class="has-text-grey-light">
										<!-- Tags -->
										<font-awesome-icon :icon="['fa', 'tags']" fixed-width />
										<span v-if="Array.isArray(hit.fields.tags)">
											<router-link
												v-for="tag in hit.fields.tags"
												:key="tag"
												:to="{ name: 'Search', query: { tag: tag }}">
												<span class="tag is-info" style="margin-left: .5rem;">{{ tag }}</span>
											</router-link>
										</span>
										<span v-else>
											<router-link
												v-if="hit.fields.tags"
												:to="{ name: 'Search', query: { tag: hit.fields.tags }}">
												<span class="tag is-info" style="margin-left: .5rem;">{{ hit.fields.tags }}</span>
											</router-link>
										</span>
									</div>
								</div>
							</div>

							<!-- Pagination -->
							<nav class="pagination is-centered" aria-label="pagination" role="navigation" v-if="totalHits > 0">
								<a class="pagination-previous" @click="prevPage" v-bind:disabled="query.page <= 1">Previous</a>
								<a class="pagination-next" @click="nextPage" v-bind:disabled="!hasNextPage">Next page</a>

								<ul class="pagination-list">
									<li><a class="pagination-link">{{ query.page }}</a></li>
								</ul>
							</nav>
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
		name: 'Search',
		components: { DefaultLayout, Loader },
		data () {
			return {
				hits: [],
				facets: {},
				took: undefined,
				totalHits: undefined,
				loading: true,

				// The search refreshes when these variables change
				query: {
					page: 1,
					q: '',
					tag: []
				}
			}
		},
		computed: {
			hasPrevPage () {
				if (this.query.page > 1) {
					return true
				}
				return false
			},
			hasNextPage () {
				if ((this.query.page * 10) < this.totalHits) {
					return true
				}
				return false
			},
			startsAt () {
				return ((this.query.page - 1) * 10) + 1
			},
			endsAt () {
				let ends = ((this.query.page - 1) * 10) + 10
				return ends > this.totalHits ? this.totalHits : ends
			}
		},
		watch: {
			$route () {
				this.fetchData()
			}
		},
		created () {
			this.fetchData()
		},
		methods: {
			parseQuery () {
				var vm = this

				this.query.q = this.$route.query.q || ''
				this.query.page = this.$route.query.page || 1

				this.query.tag = []
				if (this.$route.query.tag !== undefined) {
					if (Array.isArray(this.$route.query.tag)) {
						this.$route.query.tag.forEach(function(item) {
							vm.query.tag.push(item)
						})
					} else {
						this.query.tag.push(this.$route.query.tag)
					}
				}
				window.document.title = 'Search: ' + this.query.q
			},
			// Fetch the page contents from the api
			fetchData () {
				var vm = this
				vm.loading = true
				vm.parseQuery()

				this.$axios.get('/api/search?' + this.queryToURL())
					.then(function (response) {
						vm.hits = response.data.hits
						vm.took = (response.data.took / 1000000000).toFixed(4)
						vm.totalHits = response.data.total_hits
						vm.facets = response.data.facets
						scroll(0,0)
						vm.loading = false
					})
					.catch(function (error) {
						vm.error = true
						vm.loading = false
						console.log(error.message)
					})
				// end Axios GET

			}, // end fetchData

			queryToURL () {
				var query = []

				if (this.query.q !== '') {
					query.push('q=' + this.query.q)
				}

				if (this.query.page > 1) {
					query.push('from=' + ((this.query.page - 1) * 10))
				}

				this.query.tag.forEach((item) => {
					query.push('tag=' + item)
				})

				return query.join('&')
			},

			effectiveQuery () {
				var query = {}
				if (this.query.q !== '') {
					query.q = this.query.q
				}
				if (this.query.page > 1) {
					query.page = this.query.page
				}
				if (this.query.tag.length > 0) {
					query.tag = this.query.tag.slice()
				}
				return query
			},

			nextPage () {
				if (this.hasNextPage === true) {
					this.query.page++
					this.refresh()
				}
			},
			prevPage () {
				if (this.hasPrevPage === true) {
					this.query.page--
					this.refresh()
				}
			},
			refresh () {
				this.$router.push({ name: 'Search', query: this.effectiveQuery() })
			}
		}
	}
</script>

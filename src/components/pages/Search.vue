<template>
	<div>

		<!-- Search Input -->
		<section class="hero is-light">
			<div class="hero-body">
				<div class="container is-fluid">
					<form v-on:submit.prevent="query.page = 1; refresh()">
						<div class="field has-addons">
							<div class="control is-expanded has-icons-left">
								<input class="input" type="text" placeholder="Search Query" v-model="query.q">
								<span class="icon is-small is-left">
									<font-awesome-icon :icon="['fa', 'search']" />
								</span>
							</div>
							<div class="control">
								<button type="submit" class="button is-primary">
									Search
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>

		<!-- Search Results -->
		<section class="section">
			<div class="container is-fluid">

				<!-- Loading Icon -->
				<div v-if="loading">
					<loader></loader>
				</div>

				<!-- Once Loaded -->
				<div v-else>
					<div class="columns">

						<!-- Search Results -->
						<div class="column">
							<div class="container is-fluid is-devpad-content">

								<!-- No Results Warning -->
								<article class="notification has-text-warning pt-6 pb-6 has-text-centered" v-if="totalHits === 0">
									<div class="title">
										<font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
										No Results Found!
									</div>
									<div class="subtitle">
										Try modifying your search parameters.
									</div>
								</article>

								<!-- Search Hits -->
								<div style="margin-bottom: 2.5rem;" v-for="hit in hits" :key="hit.id">
										
									<!-- Page Title -->
									<router-link class="subtitle is-5 has-text-link" :to="{ name: 'ViewPage', params: { slug: hit.id }}">
										{{ hit.fields['metadata.title'] || hit.id }}
									</router-link>

									<!-- Show Hit Fragments or partial contents -->
									<div v-if="hit.fragments && hit.fragments.contents">
										<p v-for="fragment in hit.fragments.contents" v-html="fragment" :key="fragment.id"></p>
									</div>
									<div v-else>
										<p>
											{{ hit.fields.contents | truncate }}
										</p>
									</div>

									<!-- Page Metadata -->
									<div class="has-text-grey-light">

										<!-- Modified Date -->
										<div style="margin-top: 0.5rem;">
											<font-awesome-icon :icon="['fa', 'calendar']" fixed-width />
											Modified {{ formatDate(hit.fields['metadata.modified']) }}
										</div>

										<!-- Tags -->
										<div style="margin-top: 0.5rem;" v-if="hit.fields['metadata.tags']">
											<font-awesome-icon :icon="['fa', 'tags']" fixed-width />
											<span v-if="Array.isArray(hit.fields['metadata.tags'])">
												<router-link
													v-for="tag in hit.fields['metadata.tags']"
													:key="tag"
													:to="{ name: 'Search', query: { tag: tag }}">
													<span class="tag is-primary" style="margin-left: .5rem;">{{ tag }}</span>
												</router-link>
											</span>
											<span v-else>
												<router-link
													v-if="hit.fields['metadata.tags']"
													:to="{ name: 'Search', query: { tag: hit.fields['metadata.tags'] }}">
													<span class="tag is-primary" style="margin-left: .5rem;">{{ hit.fields['metadata.tags'] }}</span>
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

						<!-- Filters -->
						<div class="column is-narrow is-hidden-mobile">

							<!-- Sort Order -->
							<nav class="panel is-devpad-sidebar">

								<p class="panel-heading" style="border-bottom: none;">
									Sort Order
								</p>

								<div>
									<div class="field">
										<div class="control">
											<div class="select is-fullwidth">
												<select v-model="query.sort" @change="query.page = 1; refresh()">
													<option value="">--</option>
													<option value="metadata.modified">Modification Date (Oldest)</option>
													<option value="-metadata.modified">Modification Date (Newest)</option>
													<option value="metadata.title">Title (Ascending)</option>
													<option value="-metadata.title">Title (Descending)</option>
												</select>
											</div>
										</div>
									</div>
								</div>

							</nav>

							<!-- Tag Filter -->
							<nav class="panel is-devpad-sidebar" v-if="facets.tags">
								<p class="panel-heading">
									Tags
								</p>

								<label class="panel-block" v-for="tag in facets.tags.terms" :key="tag.term">
									<input type="checkbox" :value="tag.term" v-model="query.tag" @change="query.page = 1; refresh()">
									<span class="has-flex-grow">{{ tag.term }}</span>
									<span class="tag is-light ml-1 is-pulled-right">{{ tag.count }}</span>
								</label>

								<div class="panel-block" v-if="query.tag.length > 0">
									<button class="button is-link is-outlined is-fullwidth" @click="query.tag = []; refresh()">
										clear
									</button>
								</div>
							</nav>

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
		name: 'Search',
		components: { Loader },
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
					tag: [],
					sort: ''
				}
			}
		},
		computed: {

			// Is there a previous page of results?
			hasPrevPage () {
				if (this.query.page > 1) {
					return true
				}
				return false
			},

			// Is there a next page of results?
			hasNextPage () {
				if ((this.query.page * 10) < this.totalHits) {
					return true
				}
				return false
			},

			// What is the index of the first result on this page?
			startsAt () {
				return ((this.query.page - 1) * 10) + 1
			},

			// What is the index of the last result on this page?
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
		filters: {
			truncate (value) {
				let truncate_at = 250

				if (value.length > truncate_at)
					return value.substring(0, truncate_at) + '...'
				else
					return value
			}
		},
		methods: {

			formatDate (value) {
				return this.$moment(value).format('MMMM Do YYYY, h:mm a')
			},

			// Parse the values out of the query string, and assign them to
			// the VM data values.
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

				this.query.sort = this.$route.query.sort || ''

				window.document.title = 'Search: ' + this.query.q
			},

			// Fetch the page contents from the api
			fetchData () {
				var vm = this
				vm.loading = true
				vm.parseQuery()

				this.$axios.get('/api/search?' + this.queryToURL(), {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
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
					if (error.response) {
						if (error.response.status === 401) {
							vm.$bus.$emit('logout')
						}
					}
				})
				// end Axios GET

			}, // end fetchData

			// Convert the VM data query value to a URL to send to the API
			// endpoint to fetch results.
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

				if (this.query.sort !== '') {
					query.push('sort=' + this.query.sort)
				}

				if (this.query.q === '' && this.query.sort === '') {
					query.push('sort=-metadata.modified')
				}

				return query.join('&')
			},

			// Convert the current VM data query to a set of URL parameters to
			// be passed to the router to reload the page.
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
				if (this.query.sort !== '') {
					query.sort = this.query.sort
				}
				return query
			},

			// Go to the next page of results
			nextPage () {
				if (this.hasNextPage === true) {
					this.query.page++
					this.refresh()
				}
			},

			// Go to the previous page of results
			prevPage () {
				if (this.hasPrevPage === true) {
					this.query.page--
					this.refresh()
				}
			},

			// Refresh the search page.
			refresh () {
				this.$router.push({ name: 'Search', query: this.effectiveQuery() })
			}
		}
	}
</script>

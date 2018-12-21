<template>
	<section class="section">
		<div class="container">

			<div v-if="loading">
				<loader></loader>
			</div>

			<div v-else>
				<div v-if="notFound === true">
					<div class="col">
						<create-new-message :slug="slug"></create-new-message>
					</div>
				</div>

				<div class="columns" v-else>

					<div class="column is-one-quarter is-hidden-mobile">
						<span class="subtitle is-5 has-text-primary">Table of Contents</span>
						<br><br>
						<div class="toc-list">
							<div class="toc-item" v-for="heading in pageWithTOC.toc" :class="'heading-' + heading.depth" :key="heading.index">
								<a class="pointer" :href="'#toc_' + heading.index" :title="heading.title">
									{{ heading.title }}
								</a>
							</div>
						</div>
					</div>

					<div class="column is-auto-x is-break-word">

						<div class="columns is-vcentered is-mobile">
							<div class="column">
								<div class="title">{{ page.title }}</div>
							</div>

							<!-- Page Controls -->
							<div class="column is-narrow">
								<div class="dropdown is-right" ref="pageControls">
									<div class="dropdown-trigger">

										<!-- Button Group -->
										<div class="buttons has-addons mb-0">
											<!-- Edit Button -->
											<router-link class="button mb-0" :to="{ name: 'EditPage', params: { slug: slug }}">
												<span class="icon is-small">
													<font-awesome-icon :icon="['fa', 'edit']" />
												</span>
												<span>Edit</span>
											</router-link>

											<button class="button mb-0" aria-haspopup="true" aria-controls="page-controls-menu" @click="$refs.pageControls.classList.toggle('is-active')">
												<span class="icon is-small">
													<font-awesome-icon :icon="['fa', 'angle-down']" />
												</span>
											</button>
										</div>
										<!-- End Button Group -->

										<div class="dropdown-menu" id="page-controls-menu" role="menu">
											<div class="dropdown-content">
												<a class="dropdown-item">
													Move
												</a>
												<a class="dropdown-item" @click="deletePage">
													Delete
												</a>
											</div>
										</div>

									</div>
								</div>
							</div>
							<!-- End Page Controls -->

						</div>

						<!-- Page Meta Info -->
						<div class="has-text-grey-light">

							<!-- Updated Date -->
							<div style="margin-bottom: .5rem;">
								<font-awesome-icon :icon="['fa', 'calendar']" fixed-width />
								Modified {{ formattedDate }}
							</div>

							<!-- Tags -->
							<div style="margin-bottom: .5rem;" v-if="page.tags.length > 0">
								<font-awesome-icon :icon="['fa', 'tags']" fixed-width />
								<router-link v-for="tag in page.tags" :key="tag" :to="{ name: 'Search', query: { tag: tag }}">
									<span class="tag is-link" style="margin-left: .5rem;">{{ tag }}</span>
								</router-link>
							</div>

						</div>

						<hr>

						<!-- Page Content -->
						<div class="content" v-html="pageWithTOC.page"></div>

					</div>

				</div>
			</div>

		</div>
	</section>
</template>

<script>
	import CreateNewMessage from '../elements/CreateNewMessage.vue'
	import Loader from '../elements/Loader.vue'

	export default {
		name: 'ViewPage',
		props: ['slug'],
		components: { CreateNewMessage, Loader },
		data () {
			return {
				page: {
					title: '',
					content: '',
					tags: [],
					modified: undefined
				},
				notFound: undefined,
				loading: true
			}
		},
		computed: {
			formattedDate () {
				return this.$moment(this.page.modified).format('MMMM Do YYYY, h:mm a');
			},
			pageWithTOC () {
				var toc = []
				var minDepth = 6

				// Get a list of all headings
				var parser = new DOMParser();
				var doc = parser.parseFromString(this.page.content, "text/html");

				var headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

				for (var i = 0; i < headings.length; ++i) {
					toc[i] = {
						title: headings[i].innerText,
						depth: parseInt(headings[i].nodeName.charAt(1)),
						index: i
					}

					headings[i].id = 'toc_' + i

					if (toc[i].depth < minDepth) { minDepth = toc[i].depth }
				}

				if (minDepth > 1) {
					for (var i = 0; i < toc.length; ++i) {
						toc[i].depth = toc[i].depth - (minDepth - 1)
					}
				}

				return { page: doc.body.innerHTML, toc: toc }
			}
		},
		created () {
			this.fetchData()
		},
		watch: {
			slug () {
				this.fetchData()
				window.scrollTo(0, 0)
			}
		},
		methods: {
			// Fetch the page contents from the api
			fetchData () {
				var vm = this
				vm.loading = true
				vm.notFound = undefined
				vm.pageContent = ''

				this.$axios.get('/api/pages/' + this.slug + '?format=html', {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					vm.loading = false
					vm.page.title = response.data.metadata.title
					vm.page.tags = response.data.metadata.tags
					vm.page.content = response.data.contents
					vm.page.modified = new Date(response.data.metadata.modified)

					if (vm.page.title === '') {
						vm.page.title = vm.slug
					}

					window.document.title = (vm.page.title === '') ? vm.slug : vm.page.title
				})
				.catch(function (error) {
					vm.loading = false
					console.log(error.message)
					if (error.response) {
						if (error.response.status === 401) {
							vm.$bus.$emit('logout')
						}
						if (error.response.status === 404) {
							vm.notFound = true
						}
					}
				})
			}, // end fetchData
			editPage () {
				this.$router.push({ path: `/pages/${this.slug}/edit` })
			}, // end editPage
			deletePage () {
				if (confirm('Are you sure you want to permanently delete this page?') === false) {
					return
				}
				var vm = this

				this.$axios.delete('/api/pages/' + this.slug, {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					if (response.status === 200) {
						vm.$router.push({ path: `/` })
					}
				})
				.catch(function (error) {
					console.log(error.message)
					if (error.response) {
						if (error.response.status === 401) {
							vm.$bus.$emit('logout')
						}
					}
				})
			} // end deletePage
		}
	}
</script>

<style>
	/*
		Set the indentation on the table of contents
	*/
	.toc-item {
		padding-bottom: 1rem;
		word-break: break-word;
	}
	.toc-item.heading-1 {
		margin-left: 0rem;
	}
	.toc-item.heading-2 {
		margin-left: 1.5rem;
	}
	.toc-item.heading-3 {
		margin-left: 3rem;
	}
	.toc-item.heading-4 {
		margin-left: 4.5rem;
	}
	.toc-item.heading-5 {
		margin-left: 6rem;
	}
	.toc-item.heading-6 {
		margin-left: 7.5rem;
	}
</style>
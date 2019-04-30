<template>
	<section class="section">

		<div class="container is-fluid">

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

					<div class="column is-auto-x is-break-word">

						<div class="container is-fluid is-devpad-content">

							<div class="columns is-vcentered is-mobile" style="margin-bottom: 0;">
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
													<a class="dropdown-item" @click="openMovePageModal">
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
										<span class="tag is-primary" style="margin-left: .5rem;">{{ tag }}</span>
									</router-link>
								</div>

							</div>

							<hr>

							<!-- Page Content -->
							<div class="content" v-html="pageWithTOC.page" v-on:click="test_click"></div>

						</div>

					</div>

					<div class="column is-narrow is-hidden-mobile">
						<div class="toc-container is-devpad-sidebar">
							<span class="subtitle is-5">Table of Contents</span>
							<br><br>
							<div class="toc-list">
								<div class="toc-item" v-for="heading in pageWithTOC.toc" :class="'heading-' + heading.depth" :key="heading.index">
									<a class="pointer" :href="'#toc_' + heading.index" :title="heading.title">
										{{ heading.title }}
									</a>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

		</div>

		<!-- Move Page Modal -->
		<div class="modal" ref="movePageModal">
			<div class="modal-background" @click="closeMovePageModal"></div>
			<div class="modal-content">
				<div class="card">
					<div class="card-header">
						<div class="card-header-title">
							<font-awesome-icon :icon="['fa', 'plus']" fixed-width />
							&nbsp;
							Move Page
						</div>
					</div>
					<div class="card-content">
						<form @submit.prevent="renamePage">
							<div class="field">
								<div class="control">
									<input class="input" type="text" placeholder="New Slug" v-model="movePageSlug" ref="movePageSlugInput">
								</div>
							</div>

							<div class="field is-grouped">
								<div class="control">
									<button class="button is-link">Move Page</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close" @click="closeMovePageModal"></button>
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
				loading: true,
				movePageSlug: ''
			}
		},
		computed: {
			formattedDate () {
				return this.$moment(this.page.modified).format('MMMM Do YYYY, h:mm a')
			},
			pageWithTOC () {
				let toc = []
				let minDepth = 6

				// Get a list of all headings
				let parser = new DOMParser()
				let doc = parser.parseFromString(this.page.content, "text/html")

				let headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

				for (let i = 0; i < headings.length; ++i) {
					toc[i] = {
						title: headings[i].innerText,
						depth: parseInt(headings[i].nodeName.charAt(1)),
						index: i
					}

					headings[i].id = 'toc_' + i

					if (toc[i].depth < minDepth) { minDepth = toc[i].depth }
				}

				if (minDepth > 1) {
					for (let i = 0; i < toc.length; ++i) {
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

			// Catch relative links and call router instead of reloading page
			test_click (event) {
				let vm = this

				// If it's not a link, we don't care
				if (event.target.tagName !== 'A') {
					return
				}

				// Regex to detect relative links
				let rel_link_regex = new RegExp('^(?:[a-z]+:)?//', 'i')
				if (rel_link_regex.test(event.target.getAttribute('href')) === false) {
					event.preventDefault()
					vm.$router.push({ path: event.target.getAttribute('href') })
				}
			},

			closeMovePageModal () {
				this.$refs.movePageModal.classList.remove('is-active')
			},

			openMovePageModal () {
				this.newPageSlug = ''
				this.$refs.movePageModal.classList.add('is-active')
				this.$refs.pageControls.classList.remove('is-active')
				this.$refs.movePageSlugInput.focus()
			},

			// Fetch the page contents from the api
			fetchData () {
				let vm = this
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
			},

			editPage () {
				this.$router.push({ path: `/pages/${this.slug}/edit` })
			},

			deletePage () {
				this.$refs.pageControls.classList.remove('is-active')
				if (confirm('Are you sure you want to permanently delete this page?') === false) {
					return
				}
				let vm = this

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
			},

			renamePage () {
				let vm = this

				this.$axios.get('/api/pages/' + this.slug + '/rename?id=' + vm.movePageSlug, {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					if (response.status === 200) {
						vm.$router.push({ name: 'ViewPage', params: { slug: vm.movePageSlug } })
						vm.closeMovePageModal()
						vm.$refs.pageControls.classList.remove('is-active')
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
			}
		}
	}
</script>

<style>
	/*
		Set the indentation on the table of contents
	*/
	.toc-container {
		padding-left: 1rem;
		border-left: 2px solid whitesmoke;
		min-height: 250px;
	}
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
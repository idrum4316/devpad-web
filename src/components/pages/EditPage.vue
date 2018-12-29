<template>
	<section class="section is-paddingless">

		<!-- Loading Icon -->
		<div v-if="loading">
			<loader></loader>
		</div>

		<div v-show="loading === false">

			<!-- Toolbar -->
			<div class="devpad-toolbar is-clearfix">

				<!-- Left Side -->
				<div class="is-toolbar-left">
					<span class="title is-4">Editing {{ slug }}</span>
				</div>

				<!-- Right Side -->
				<div class="is-toolbar-right">
					<button class="button is-small is-primary is-outlined mr-1" @click="view = 'edit'" v-show="view === 'preview'">
						<span class="icon">
							<font-awesome-icon :icon="['fa', 'edit']" />
						</span>
						<span>Edit</span>
					</button>
					<button class="button is-small is-primary is-outlined mr-1" @click="view = 'preview'; getPreview();" v-show="view === 'edit'">
						<span class="icon">
							<font-awesome-icon :icon="['fa', 'eye']" />
						</span>
						<span>Preview</span>
					</button>
					<button class="button is-small is-warning is-outlined mr-1" @click="cancelEdit">
						<span class="icon">
							<font-awesome-icon :icon="['fa', 'ban']" />
						</span>
						<span>Cancel</span>
					</button>
					<button class="button is-small is-success is-outlined" @click="savePage">
						<span class="icon">
							<font-awesome-icon :icon="['fa', 'save']" />
						</span>
						<span>Save</span>
					</button>
				</div>

			</div>

			<!-- Edit View -->
			<div class="columns is-gapless">

				<!-- Markdown Editor / Preview -->
				<div class="column">
					<div class="editor-container">

						<!-- Editor -->
						<div id="editor" ref="editor" v-show="view === 'edit'"></div>

						<!-- Preview -->
						<div class="container is-fluid pr-2 pl-2" v-show="view === 'preview'">
							<div class="is-devpad-content pt-2 pb-2">
								<div v-if="previewLoading">
									<loader></loader>
								</div>
								<div v-else>
									<div class="content" v-html="preview"></div>
								</div>
							</div>
						</div>

					</div>
				</div>

				<!-- Metadata Fields -->
				<div class="column is-narrow is-hidden-mobile">
					<div class="is-devpad-sidebar pr-2 pl-2 pt-1 pb-1">

						<!-- Display Title -->
						<div class="field">
							<label class="label">Display Title</label>
							<p class="control">
								<input class="input" type="text" v-model="pageDisplayTitle" @change="dirty=true" :placeholder="slug">
							</p>
						</div>

						<!-- Tags -->
						<div class="field">
							<label class="label">Tags</label>
							<div class="field is-grouped is-grouped-multiline">
								<div class="control" v-for="tag in tagList" :key="tag">
									<div class="tags has-addons">
										<span class="tag is-link">{{ tag }}</span>
										<a class="tag is-delete" @click="removeTag(tag)"></a>
									</div>
								</div>
							</div>
							<div class="control has-icons-left">
								<input class="input" type="text" v-model="tagInput" placeholder="Add Tag" @keyup.enter.prevent="addTag" @keydown.tab.prevent="addTag" @keydown.188.prevent="addTag">
								<span class="icon is-small is-left">
									<font-awesome-icon :icon="['fa', 'plus']" />
								</span>
							</div>
						</div>

					</div>
				</div>

			</div>

		</div>

	</section>
</template>

<script>
	import Loader from '../elements/Loader.vue'

	export default {
		name: 'EditPage',
		props: ['slug'],
		components: { Loader },
		data () {
			return {
				editor: Object,
				pageDisplayTitle: '',
				tagInput: '',
				tagList: [],
				pageModifiedDate: undefined,
				loading: true,
				view: 'edit',
				previewLoading: false,
				preview: '',
				dirty: false
			}
		},
		computed: {
			formattedDate () {
				return this.$moment(this.pageModifiedDate).format('MMMM Do YYYY, h:mm a')
			}
		},
		watch: {
			slug () {
				this.fetchPage()
			}
		},
		mounted () {
			this.editor = ace.edit(this.$refs['editor'])
			this.editor.setTheme('ace/theme/dawn')
			this.editor.getSession().setMode('ace/mode/markdown')
			this.editor.getSession().setUseWrapMode(true)

			this.editor.setOptions({
				fontSize: '14px',
				scrollPastEnd: true
			})

			this.fetchPage()
		},
		created () {
			window.document.title = 'Editing ' + this.slug
		},
		beforeRouteLeave (to, from , next) {
			if (this.dirty) {
				let answer = window.confirm('Do you really want to leave? Any unsaved changes will be lost.')
				if (answer) {
					next()
				} else {
					next(false)
				}
			} else {
				next()
			}
			
		},
		methods: {

			fetchPage () {
				var vm = this
				vm.loading = true
				this.$axios.get('/api/pages/' + this.slug + '?format=source', {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					vm.pageDisplayTitle = response.data.metadata.title
					vm.tagList = response.data.metadata.tags
					vm.editor.setValue(response.data.contents, -1)
					vm.pageModifiedDate = new Date(response.data.metadata.modified)
					vm.editor.on('change', () => {
						vm.dirty = true
					})
					vm.loading = false
				})
				.catch(function (error) {
					if (error.response) {
						if (error.response.status === 401) {
							vm.$bus.$emit('logout')
						}
					}
					vm.pageDisplayTitle = ''
					vm.pageTags = ''
					vm.editor.setValue('', -1)
					vm.pageModifiedDate = undefined
					vm.loading = false
					console.log(error.message)
				})
			}, // end fetchPage

			savePage () {
				let content = this.editor.getValue()
				var vm = this

				this.$axios.put('/api/pages/' + this.slug, {
					metadata: {
						title: this.pageDisplayTitle,
						tags: this.tagList,
					},
					contents: content
				}, {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					if (response.status === 200) {
						vm.dirty = false
						vm.$router.push({ path: `/pages/${vm.slug}` })
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
			}, // end savePage

			cancelEdit () {
				this.$router.push({ path: `/pages/${this.slug}` })
			}, // end cancelEdit

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
						vm.dirty = false
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
			}, // end deletePage

			getPreview () {
				let content = this.editor.getValue()
				var vm = this
				vm.preview = ''

				vm.previewLoading = true
				this.$axios.post('/api/preview', {
					contents: content
				}, {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
				.then(function (response) {
					vm.previewLoading = false
					vm.preview = response.data.contents
				})
				.catch(function (error) {
					vm.previewLoading = false
					console.log(error.message)
					if (error.response) {
						if (error.response.status === 401) {
							vm.$bus.$emit('logout')
						}
					}
				})
			}, // end getPreview

			addTag () {
				let i = this.tagList.indexOf(this.tagInput)
				if (i === -1 && this.tagInput !== '') {
					this.tagList.push(this.tagInput)
					this.dirty = true
				}
				this.tagInput = ''
			},

			removeTag (tag) {
				let i = this.tagList.indexOf(tag)
				if (i > -1) {
					this.tagList.splice(i, 1);
					this.dirty = true
				}
			}
		}
	}
</script>

<style scoped>
	.devpad-toolbar {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #dbdbdb;
	}
	.devpad-toolbar .is-toolbar-left {
		float: left;
	}
	.devpad-toolbar .is-toolbar-right {
		float: right;
	}
	#editor {
		height: 100%;
		width: 100%;
	}
	.editor-container {
		overflow-y: auto;
		height: calc(100vh - 101px);
		border-right: 1px solid #dbdbdb;
	}
</style>

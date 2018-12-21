<template>
	<nav class="navbar is-dark">
		<div class="container">
			<div class="navbar-brand">
				<router-link :to="{ name: 'Home' }" class="navbar-item">
					<img src="/devpad-logo-text.png" alt="Devpad Logo" height="28">
				</router-link>
				<div class="navbar-burger burger" @click="toggleMenu" ref="toggle">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>

			<div class="navbar-menu" ref="menu">
				<div class="navbar-start">
					<form @submit.prevent="executeSearch" class="navbar-item">
						<div class="field">
							<div class="control has-icons-left">
								<input class="input is-rounded" type="text" placeholder="Search" v-model="searchInput" ref="search">
								<span class="icon is-small is-left">
									<font-awesome-icon :icon="['fa', 'search']" />
								</span>
							</div>
						</div>
					</form>
				</div>

				<div class="navbar-end">

					<!-- Home -->
					<router-link class="navbar-item" :to="{ name: 'Home' }">
						<font-awesome-icon :icon="['fa', 'home']" fixed-width />
						&nbsp;
						Home
					</router-link>

					<!-- Search -->
					<router-link class="navbar-item" :to="{ name: 'Search' }">
						<font-awesome-icon :icon="['fa', 'search']" fixed-width />
						&nbsp;
						Search
					</router-link>

					<!-- All Tags -->
					<router-link class="navbar-item" :to="{ name: 'AllTags' }">
						<font-awesome-icon :icon="['fa', 'tags']" fixed-width />
						&nbsp;
						Tags
					</router-link>

					<!-- New Page Modal -->
					<a class="navbar-item" @click="openNewPageModal">
						<font-awesome-icon :icon="['fa', 'plus']" fixed-width />
						&nbsp;
						New
					</a>

					<!-- Settings -->
					<router-link class="navbar-item" :to="{ name: 'Settings' }">
						<font-awesome-icon :icon="['fa', 'cogs']" fixed-width />
						&nbsp;
						Settings
					</router-link>

					<!-- Logout -->
					<a class="navbar-item" @click="logout">
						<font-awesome-icon :icon="['fa', 'sign-out-alt']" fixed-width />
						&nbsp;
						Logout
					</a>

				</div>
			</div>
		</div>

		<div class="modal" ref="newPageModal">
			<div class="modal-background" @click="closeNewPageModal"></div>
			<div class="modal-content">
				<div class="card">
					<div class="card-header">
						<div class="card-header-title">
							<font-awesome-icon :icon="['fa', 'plus']" fixed-width />
							&nbsp;
							Create New Page
						</div>
					</div>
					<div class="card-content">
						<form @submit.prevent="goToPage">
							<div class="field">
								<div class="control">
									<input class="input" type="text" placeholder="page-slug" v-model="newPageSlug" ref="newPageSlugInput">
								</div>
							</div>

							<div class="field is-grouped">
								<div class="control">
									<button class="button is-link">Create</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close" @click="closeNewPageModal"></button>
		</div>
	</nav>
</template>

<script>
	export default {
		name: 'TopNav',
		data () {
			return {
				searchInput: '',
				newPageSlug: ''
			}
		},
		watch: {
			$route () {
				this.closeMenu()
			}
		},
		methods: {
			executeSearch () {
				this.$router.push({ name: 'Search', query: { q: this.searchInput }})
			},
			toggleMenu () {
				this.$refs.menu.classList.toggle('is-active')
				this.$refs.toggle.classList.toggle('is-active')
			},
			openMenu () {
				this.$refs.menu.classList.add('is-active')
				this.$refs.toggle.classList.add('is-active')
			},
			closeMenu () {
				this.$refs.menu.classList.remove('is-active')
				this.$refs.toggle.classList.remove('is-active')
			},
			closeNewPageModal () {
				this.$refs.newPageModal.classList.remove('is-active')
			},
			openNewPageModal () {
				this.newPageSlug = ''
				this.$refs.newPageModal.classList.add('is-active')
				this.$refs.newPageSlugInput.focus()
			},
			goToPage () {
				this.closeNewPageModal()
				this.$router.push({ name: 'EditPage', params: { slug: this.newPageSlug }})
			},
			logout () {
				this.$bus.$emit('logout')
			}
		}
	}
</script>

<style>
	.navbar {
		border-radius: 0;
	}

	/*
		Fix the background color on tablets
	*/
	@media screen and (max-width: 1087px) {
		.navbar-menu {
			background-color: inherit;
		}
	}
</style>
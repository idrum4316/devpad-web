<template>
	<div>
		<section class="section">
			<div class="container">

				<div class="tabs">
                    <ul>
                        <li v-bind:class="{ 'is-active': view === 'account' }">
                            <a @click="view = 'account'">
                                <span class="icon is-small">
                                    <font-awesome-icon :icon="['fa', 'user']" />
                                </span>
                                <span>Account</span>
                            </a>
                        </li>
						<li v-if="is_admin" v-bind:class="{ 'is-active': view === 'manage_users' }">
                            <a @click="view = 'manage_users'">
                                <span class="icon is-small">
                                    <font-awesome-icon :icon="['fa', 'users']" />
                                </span>
                                <span>Manage Users</span>
                            </a>
                        </li>
                    </ul>
                </div>

				<!-- Account Tab Content -->
				<div v-show="view === 'account'">
					<div class="title">Change Password</div>

					<!-- Failure Alert -->
					<div class="notification is-danger" v-if="password_change.error">
						<font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
						Password update failed.
					</div>

					<!-- Success Alert -->
					<div class="notification is-success" v-if="password_change.success">
						<font-awesome-icon :icon="['fa', 'check']" />
						Password updated.
					</div>

					<!-- Password Change Form -->
					<form @submit.prevent="changePassword">
						<div class="field">
							<label class="label">Current Password</label>
							<div class="control">
								<input class="input" type="password" name="current_password" v-model="password_change.current">
							</div>
						</div>
						<div class="field">
							<label class="label">New Password</label>
							<div class="control">
								<input class="input" type="password" name="new_password" v-model="password_change.new">
							</div>
						</div>
						<div class="field">
							<label class="label">Confirm Password</label>
							<div class="control">
								<input class="input" type="password" name="confirm_password" v-model="password_change.confirm">
							</div>
						</div>
						<div class="field is-grouped">
							<div class="control">
								<button class="button is-primary" v-bind:class="{ 'is-loading': password_change.loading }" type="submit">Submit</button>
							</div>
						</div>
					</form>
				</div>

				<!-- Manage Users Tab Content -->
				<div v-show="view === 'manage_users'">
					<div class="title">Create Account</div>

					<!-- Failure Alert -->
					<div class="notification is-danger" v-if="create_account.error">
						<font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
						Account creation failed.
					</div>

					<!-- Success Alert -->
					<div class="notification is-success" v-if="create_account.success">
						<font-awesome-icon :icon="['fa', 'check']" />
						Account created.
					</div>

					<!-- Account Creation Form -->
					<form @submit.prevent="createAccount">
						<div class="field">
							<label class="label">Username</label>
							<div class="control">
								<input class="input" type="text" name="username" v-model="create_account.username">
							</div>
						</div>
						<div class="field">
							<label class="label">Password</label>
							<div class="control">
								<input class="input" type="password" name="new_password" v-model="create_account.password">
							</div>
						</div>
						<div class="field">
							<label class="label">Confirm Password</label>
							<div class="control">
								<input class="input" type="password" name="confirm_password" v-model="create_account.confirm">
							</div>
						</div>
						<div class="field">
							<div class="control">
								<label class="checkbox">
									<input type="checkbox" v-model="create_account.is_admin">
									Is Administrator
								</label>
							</div>
						</div>
						<div class="field is-grouped">
							<div class="control">
								<button class="button is-primary" v-bind:class="{ 'is-loading': create_account.loading }" type="submit">Submit</button>
							</div>
						</div>
					</form>
				</div>

			</div>
		</section>
	</div>
</template>

<script>
	export default {
		name: 'Settings',
		data () {
			return {
				view: 'account',
                password_change: {
                    current: '',
                    new: '',
					confirm: '',
					loading: false,
					error: false,
					success: false
				},
				create_account: {
					username: '',
					password: '',
					confirm: '',
					is_admin: false,
					loading: false,
					error: false,
					success: false
				}
			}
		},
		computed: {
			is_admin () {
				return this.$store.getters.is_admin
			}
		},
		created () {
			window.document.title = 'Settings'
		},
		methods: {

			changePassword () {
				var vm = this
				vm.password_change.success = false
                vm.password_change.error = false
				vm.password_change.loading = true

				this.$axios.post('/api/account/password', {
					current: vm.password_change.current,
					new: vm.password_change.new,
					confirm: vm.password_change.confirm
                }, {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
                .then(function (response) {
                    if (response.status === 200) {
						vm.password_change.success = true
                    }
                })
                .catch(function (error) {
                    vm.password_change.error = true
                    console.log(error.message)
                })
                .then(function () {
                    vm.password_change.loading = false
                })
			},

			createAccount () {
				var vm = this
				vm.create_account.success = false
                vm.create_account.error = false
				vm.create_account.loading = true

				this.$axios.post('/api/account/new', {
					username: vm.create_account.username,
					password: vm.create_account.password,
					confirm: vm.create_account.confirm,
					is_admin: vm.create_account.is_admin
                }, {
					headers: {'jwt': localStorage.getItem('jwt')}
				})
                .then(function (response) {
                    if (response.status === 200) {
						vm.create_account.success = true
                    }
                })
                .catch(function (error) {
                    vm.create_account.error = true
                    console.log(error.message)
                })
                .then(function () {
                    vm.create_account.loading = false
                })
			}

		}
	}
</script>
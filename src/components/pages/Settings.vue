<template>
	<div>
		<section class="section">
			<div class="container">

				<div class="tabs is-boxed">
                    <ul>
                        <li class="is-active">
                            <a>
                                <span class="icon is-small">
                                    <font-awesome-icon :icon="['fa', 'user']" />
                                </span>
                                <span>Account</span>
                            </a>
                        </li>
                    </ul>
                </div>

				<div>
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
								<button class="button is-link" v-bind:class="{ 'is-loading': password_change.loading }" type="submit">Submit</button>
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
                password_change: {
                    current: '',
                    new: '',
					confirm: '',
					loading: false,
					error: false,
					success: false
                }
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
			}
		}
	}
</script>
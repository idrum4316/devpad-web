<template>
	<div>
        <form @submit.prevent="getToken" class="has-text-centered">

            <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left">
                    <input class="input" type="text" v-model="username">
                    <span class="icon is-small is-left">
                        <font-awesome-icon :icon="['fa', 'user']" />
                    </span>
                </div>
            </div>

            <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left">
                    <input class="input" type="password" v-model="password">
                    <span class="icon is-small is-left">
                        <font-awesome-icon :icon="['fa', 'key']" />
                    </span>
                </div>
            </div>

            <button class="button is-primary" v-bind:class="{ 'is-loading': loading }" type="submit">Login</button>

        </form>
	</div>
</template>

<script>
	import Loader from '../elements/Loader.vue'

	export default {
		name: 'Login',
		data () {
			return {
                username: '',
                password: '',
                loading: false
			}
		},
		methods: {
            getToken () {
                var vm = this
				vm.loading = true

				this.$axios.post('/api/auth/token', {
                    username: vm.username,
                    password: vm.password
                })
                .then(function (response) {
                    if (response.status === 200 && response.data.token) {
                        localStorage.setItem('jwt', response.data.token)
                        vm.$router.push({ path: `/` })
                    }
                })
                .catch(function (error) {
                    console.log(error.message)
                })
                .then(function () {
                    vm.loading = false
                })
            }
		}
	}
</script>
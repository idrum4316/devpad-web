<template>
    <section class="hero is-fullheight" id="login-bg">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <div class="box">
                        <div class="notification is-danger" v-if="error">
                            <font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
                            Login failed.
                        </div>

                        <form @submit.prevent="getToken">

                            <!-- username -->
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="text" placeholder="username" autofocus="" autocomplete="off" v-model="username">
                                </div>
                            </div>

                            <!-- password -->
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="password" placeholder="password" autocomplete="off" v-model="password">
                                </div>
                            </div>

                            <!-- submit -->
                            <button class="button is-block is-primary is-large is-fullwidth" v-bind:class="{ 'is-loading': loading }">Login</button>
                        
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
	import Loader from '../elements/Loader.vue'

	export default {
		name: 'Login',
		data () {
			return {
                username: '',
                password: '',
                loading: false,
                error: false
			}
		},
		methods: {
            getToken () {
                var vm = this
                vm.error = false
				vm.loading = true

				this.$axios.post('/api/auth/token', {
                    username: vm.username,
                    password: vm.password
                })
                .then(function (response) {
                    if (response.status === 200 && response.data.token) {

                        localStorage.setItem('jwt', response.data.token)
                        localStorage.setItem('is_admin', response.data.is_admin)
                        localStorage.setItem('username', response.data.username)
                        
                        vm.$store.commit('set_admin', response.data.is_admin)
                        vm.$store.commit('set_username', response.data.username)

                        vm.$router.push({ path: `/` })
                    }
                })
                .catch(function (error) {
                    vm.error = true
                    console.log(error.message)
                })
                .then(function () {
                    vm.loading = false
                })
            }
		}
	}
</script>

<style scoped>
    #login-bg {
        background-image: url(/login-bg.jpg);
        background-size: cover;
    }
</style>

<template>
    <div class="columns is-marginless is-vcentered" style="height: 100vh;">
        <div class="column has-background-link is-hidden-touch" style="height: 100%;"></div>
        <div class="column is-narrow-desktop">
            <div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'LoginLayout',
		data () {
			return {}
        },
        created () {
            window.document.title = 'Login'
        }
	}
</script>
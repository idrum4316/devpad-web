<template>
    <div>
        <router-view />
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
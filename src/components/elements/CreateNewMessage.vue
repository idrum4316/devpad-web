<template>
	<div class="has-text-centered">
		<h1 class="title">The page "{{ slug }}" doesn't exist yet.</h1>
		<h2 class="subtitle mt-0">Would you like to create it now?</h2>
		<router-link :to="'/pages/' + slug + '/edit'" class="button">
			<span class="icon">
				<font-awesome-icon :icon="['fa', 'plus']" />
			</span>
			<span>Create</span>
		</router-link>
	</div>
</template>

<script>
	export default {
		name: 'CreateNewMessage',
		props: ['slug'],
		data () {
			return {}
		}
	}
</script>

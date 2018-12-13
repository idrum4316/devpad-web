import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import ViewPage from '@/components/pages/ViewPage'
import EditPage from '@/components/pages/EditPage'
import Search from '@/components/pages/Search'
import AllTags from '@/components/pages/AllTags'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/pages/:slug/edit',
			name: 'EditPage',
			component: EditPage,
			props: true
		},
		{
			path: '/pages/:slug',
			name: 'ViewPage',
			component: ViewPage,
			props: true
		},
		{
			path: '/search',
			name: 'Search',
			component: Search
		},
		{
			path: '/tags',
			name: 'AllTags',
			component: AllTags
		}
	]
})

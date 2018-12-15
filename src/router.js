import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router ({
    mode: 'history',
    routes: [
        {
            path: '',
            component: () => import('@/components/layouts/Default'),
            children: [
                {
                    path: '/',
                    name: 'Home',
                    component: () => import('@/components/pages/Home')
                },
                {
                    path: '/pages/:slug/edit',
                    name: 'EditPage',
                    component: () => import('@/components/pages/EditPage'),
                    props: true
                },
                {
                    path: '/pages/:slug',
                    name: 'ViewPage',
                    component: () => import('@/components/pages/ViewPage'),
                    props: true
                },
                {
                    path: '/search',
                    name: 'Search',
                    component: () => import('@/components/pages/Search')
                },
                {
                    path: '/tags',
                    name: 'AllTags',
                    component: () => import('@/components/pages/AllTags')
                }
            ]
        }
    ]
})


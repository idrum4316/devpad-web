import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router ({
    mode: 'history',
    routes: [
        {
            path: '',
            component: () => import('@/components/layouts/Default'),
            children: [
                {
                    path: '/',
                    name: 'Home',
                    component: () => import('@/components/pages/Home'),
                    meta: {
                        requires_auth: true
                    }
                },
                {
                    path: '/pages/:slug/edit',
                    name: 'EditPage',
                    component: () => import('@/components/pages/EditPage'),
                    props: true,
                    meta: {
                        requires_auth: true
                    }
                },
                {
                    path: '/pages/:slug',
                    name: 'ViewPage',
                    component: () => import('@/components/pages/ViewPage'),
                    props: true,
                    meta: {
                        requires_auth: true
                    }
                },
                {
                    path: '/search',
                    name: 'Search',
                    component: () => import('@/components/pages/Search'),
                    meta: {
                        requires_auth: true
                    }
                },
                {
                    path: '/tags',
                    name: 'AllTags',
                    component: () => import('@/components/pages/AllTags'),
                    meta: {
                        requires_auth: true
                    }
                }
            ]
        },
        {
            path: '',
            component: () => import('@/components/layouts/Login'),
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: () => import('@/components/pages/Login')
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requires_auth)) {
        if (localStorage.getItem('jwt') == null) {
            next({ path: '/login' })
        } else {
            next()
        }
    } else {
        next() 
    }
})

export default router
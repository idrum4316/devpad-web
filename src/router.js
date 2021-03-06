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
                    redirect: {
                        name: 'ViewPage',
                        params: {
                            slug: 'index'
                        }
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
                },
                {
                    path: '/settings',
                    name: 'Settings',
                    component: () => import('@/components/pages/Settings'),
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
                    component: () => import('@/components/pages/Login'),
                    meta: {
                        requires_anon: true
                    }
                }
            ]
        }
    ]
})

// Apply some routing rules based on route metadata
router.beforeEach((to, from, next) => {

    // if meta.requires_auth, check for the presence of a JWT
    if (to.matched.some(record => record.meta.requires_auth)) {
        if (localStorage.getItem('jwt') == null) {
            next({ name: 'Login' })
        }
    }

    // if meta.requires_anon, make sure there is no JWT
    if (to.matched.some(record => record.meta.requires_anon)) {
        if (localStorage.getItem('jwt') != null) {
            next({ name: 'Home' })
        }
    }
    
    // do nothing
    next()
})

export default router
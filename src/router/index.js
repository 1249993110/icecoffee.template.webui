import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '../layout/Index.vue';
import nProgress from '../plugins/nprogress';
import { useKeepAliveStore } from '../store/keep-alive';
import { useUserInfoStore } from '../store/user-info';
import Home from '../views/Home.vue';

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: 'home',
                name: 'home',
                component: Home,
            },
        ],
    },
    {
        path: '/system-management',
        component: Layout,
        children: [
            {
                path: 'users',
                name: 'system-management-users',
                component: () => import('../views/system-management/Users.vue'),
            },
            {
                path: 'roles',
                name: 'system-management-roles',
                component: () => import('../views/system-management/Roles.vue'),
            },
            {
                path: 'menus',
                name: 'system-management-menus',
                component: () => import('../views/system-management/Menus.vue'),
            },
            {
                path: 'permissions',
                name: 'system-management-permissions',
                component: () => import('../views/system-management/Permissions.vue'),
            },
        ],
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/403',
        component: () => import('../views/403.vue'),
    },
    {
        path: '/404',
        component: () => import('../views/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    nProgress.start();
    if (to.path === '/login') {
        useUserInfoStore().$reset();
        next();
    } else {
        const keepAlive = useKeepAliveStore();
        if (keepAlive.activePages.length === 0 && to.name) {
            keepAlive.addPage(to.path);
        }
        next();
    }
});

router.afterEach((to, from) => {
    nProgress.done();
});

export default router;

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/auth/login',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' },
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true }, // Accessible by both admin and student
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
      {
        name: 'students',
        path: 'students',
        component: () => import('../pages/students/StudentsPage.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
      {
        name: 'notice',
        path: 'notice',
        component: () => import('../pages/notice/NoticePage.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
      {
        name: 'studentNotice',
        path: 'studentNotice',
        component: () => import('../pages/studentNotice/StudentNoticePage.vue'),
        meta: { requiresAuth: true, studentOnly: true },
      },
      {
        name: 'jobs',
        path: 'jobs',
        component: () => import('../pages/jobs/JobsPage.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },{
        name: 'company',
        path: 'company',
        component: () => import('../pages/company/CompanyPage.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      }
    ],
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAuthRoute = to.path.startsWith('/auth')

  // Unauthenticated: Redirect to login
  if (!token && !isAuthRoute) {
    return next('/auth/login')
  }

  // Authenticated: Trying to access login/signup -> Redirect to dashboard
  if (token && (to.name === 'login' || to.name === 'signup' || to.path === '/')) {
    return next({ name: 'dashboard' })
  }

  // Role-based access restriction
  if (token) {
    if (to.meta?.adminOnly && user?.type !== 'admin') {
      return next('/unauthorized')
    }

    if (to.meta?.studentOnly && user?.type !== 'student') {
      return next('/unauthorized')
    }
  }

  next()
})




export default router

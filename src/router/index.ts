import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getUser, isAuthenticated } from '../services/authService';
import type { AuthUser } from '../data/pages/authUser.ts';

import AuthLayout from '../layouts/AuthLayout.vue';
import AppLayout from '../layouts/AppLayout.vue';
import RouteViewComponent from '../layouts/RouterBypass.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    meta: { requiresAuth: true, role: 'admin' }, // ✅ Protect all admin routes
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'students',
        path: 'students',
        component: () => import('../pages/students/StudentsPage.vue'),
      },
      {
        name: 'jobs',
        path: 'jobs',
        component: () => import('../pages/jobs/JobsPage.vue'),
      },
      {
        name: 'company',
        path: 'company',
        component: () => import('../pages/company/CompanyPage.vue'),
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
      },
      {
        name: 'payments',
        path: '/payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
          },
        ],
      },
      {
        name: 'faq',
        path: '/faq',
        component: () => import('../pages/faq/FaqPage.vue'),
      },
    ],
  },
  {
    name: 'student-dashboard',
    path: '/student-dashboard',
    component: () => import('../pages/StudentDashboard.vue'),
    meta: { requiresAuth: true, role: 'student' }
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
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      window.scrollTo(0, 0);
    }
  },
  routes,
});

// 🔹 Add Route Guards for Authentication & Role-Based Access
router.beforeEach((to, from, next) => {
  const user: AuthUser | null = getUser();

  if (to.meta.requiresAuth && !isAuthenticated()) {
    // If route requires authentication and user is not logged in
    next({ name: 'login' });
  } else if (to.meta.role && user?.role !== to.meta.role) {
    // If route requires a specific role and user role doesn't match
    next({ name: 'dashboard' }); // Redirect to dashboard or any fallback page
  } else {
    next(); // Allow navigation
  }
});

export default router;

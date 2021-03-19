import Layout from '@/pages/layout/Layout'

export default [
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
        },
      },
      {
        path: '/settings/change-password',
        component: () => import('@/pages/settings/change-password'),
        name: 'changePassword',
        meta: {
          title: 'settings',
          icon: 'setting',
        },
        hidden: true,
      },
    ],
  },
]

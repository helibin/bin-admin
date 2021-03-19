import Layout from '@/pages/layout/Layout'

export default [
  {
    path: '/sign-in',
    component: () => import('@/pages/sign-in/index'),
    hidden: true,
  },
  {
    path: '/auth-redirect',
    component: () => import('@/pages/sign-in/authredirect'),
    hidden: true,
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/pages/demo/redirect/index'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/pages/demo/errorPage/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/pages/demo/errorPage/401'),
    hidden: true,
  },
  {
    path: '*',
    component: () => import('@/pages/demo/errorPage/404'),
  },
]

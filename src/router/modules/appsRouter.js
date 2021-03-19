import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/apps',
    component: AppMain,
    redirect: '/apps/list',
    name: 'Apps',
    meta: {
      title: 'apps',
      icon: 'app',
      privilege: 'apps_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/apps/list'),
        name: 'AppsList',
        meta: {
          title: 'apps',
          icon: 'app',
          privilege: 'apps_list',
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/pages/apps/edit'),
        name: 'EditApps',
        meta: {
          title: 'editApps',
          noCache: true,
          privilege: 'apps_modify',
        },
        hidden: true,
      },
    ],
  },
]

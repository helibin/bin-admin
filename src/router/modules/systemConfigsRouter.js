import Layout from '@/pages/layout/Layout'

export default [
  {
    path: '/system-configs',
    component: Layout,
    redirect: '/system-configs/list',
    name: 'systemConfigs',
    meta: {
      title: 'systemConfigs',
      icon: 'setting',
      privilege: 'systemConfigs_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/system-configs/list'),
        name: 'systemConfigsList',
        meta: {
          title: 'systemConfigs',
          icon: 'setting',
          privilege: 'systemConfigs_list',
        },
      },
      {
        path: 'edit/:id',
        name: 'editSystemConfigs',
        component: () => import('@/pages/system-configs/edit'),
        meta: {
          title: 'editSystemConfigs',
          noCache: true,
          privilege: 'systemConfigs_modify',
        },
        hidden: true,
      },
    ],
  },
]

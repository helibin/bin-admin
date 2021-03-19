import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/my/users',
    component: AppMain,
    redirect: '/my/users/list',
    name: 'myUsers',
    meta: {
      title: 'myUsers',
      icon: 'user',
      privilege: 'myUsers_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/my/users/list'),
        name: 'myUserList',
        meta: {
          title: 'myUserList',
          icon: 'user',
          privilege: 'myUsers_list',
        },
      },
      {
        path: ':id/bind-wristband',
        component: () => import('@/pages/my/users/bindWristband'),
        name: 'bindWristband',
        hidden: true,
        meta: {
          title: 'bindWristband',
          noCache: true,
          privilege: 'myUsers_modify',
        },
      },
      {
        path: ':id/unbind-wristband',
        component: () => import('@/pages/my/users/unbindWristband'),
        name: 'unbindWristband',
        hidden: true,
        meta: {
          title: 'unbindWristband',
          noCache: true,
          privilege: 'myUsers_modify',
        },
      },
      {
        path: ':id/babys/list',
        component: () => import('@/pages/my/babys/list'),
        name: 'babyList',
        hidden: true,
        meta: {
          title: 'babyList',
          noCache: true,
          privilege: 'myBabys_list',
        },
      },
    ],
  },
]

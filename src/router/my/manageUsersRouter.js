import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/my-manage-users',
    component: AppMain,
    redirect: '/my-manage-users/list',
    name: 'myManageUsers',
    meta: {
      title: 'myManageUsers',
      icon: 'admin',
      privilege: 'myManageUsers_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/my/manage-users/list'),
        name: 'myManageUsersList',
        meta: {
          title: 'myManageUsers',
          icon: 'admin',
          privilege: 'myManageUsers_list',
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/pages/my/manage-users/edit'),
        name: 'editMyManageUsers',
        meta: {
          title: 'editMyManageUsers',
          noCache: true,
          privilege: 'myManageUsers_modify',
        },
        hidden: true,
      },
      {
        path: 'set-privilege/:id',
        component: () => import('@/pages/my/manage-users/setPrivilege'),
        name: 'setPrivilegeMyManageUsers',
        meta: {
          title: 'setPrivilegeMyManageUsers',
          noCache: true,
          privilege: 'myManageUsers_setPrivilege',
        },
        hidden: true,
      },
    ],
  },
]

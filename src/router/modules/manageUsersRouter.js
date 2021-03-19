import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/manage-users',
    component: AppMain,
    redirect: '/manage-users/list',
    name: 'ManageUsers',
    meta: {
      title: 'manageUsers',
      icon: 'admin',
      privilege: 'manageUsers_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/manage-users/list'),
        name: 'ManageUsersList',
        meta: {
          title: 'manageUsers',
          icon: 'admin',
          privilege: 'manageUsers_list',
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/pages/manage-users/edit'),
        name: 'EditManageUsers',
        meta: {
          title: 'editManageUsers',
          noCache: true,
          privilege: 'manageUsers_modify',
        },
        hidden: true,
      },
      {
        path: 'set-privilege/:id',
        component: () => import('@/pages/manage-users/setPrivilege'),
        name: 'SetPrivilegeManageUsers',
        meta: {
          title: 'setPrivilegeManageUsers',
          noCache: true,
          privilege: 'manageUsers_setPrivilege',
        },
        hidden: true,
      },
    ],
  },
]

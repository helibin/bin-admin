import Layout from '@/pages/layout/Layout'

import manageUsersRouter from './modules/manageUsersRouter'
import usersRouter from './modules/usersRouter'

export default [
  {
    path: '/_userManage',
    component: Layout,
    name: 'userManage',
    meta: {
      title: 'userManage',
      icon: 'user',
      privilege: ['manageUsers_list', 'users_list'],
    },
    children: [...manageUsersRouter, ...usersRouter],
  },
]

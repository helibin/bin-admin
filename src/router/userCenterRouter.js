import Layout from '@/pages/layout/Layout'

import myUserRouter from './my/usersRouter'
// import myDevicesRouter from './my/devicesRouter'
// import myWristbandsRouter from './my/wristbandsRouter'
import myStatisticsRouter from './my/statisticsRouter'
import myManageUsersRouter from './my/manageUsersRouter'

export default [
  {
    path: '/_userCenter',
    component: Layout,
    name: 'userCenter',
    meta: {
      title: 'userCenter',
      icon: 'me',
      privilege: ['myUsers_list', 'myManageUsers_list', 'myDevices_list', 'myWristbands_list', 'myStatistics_list'],
    },
    children: [
      ...myUserRouter,
      ...myManageUsersRouter,
      // ...myWristbandsRouter,
      // ...myDevicesRouter,
      ...myStatisticsRouter,
    ],
  },
]

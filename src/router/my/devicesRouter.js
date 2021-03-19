import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/my/devices',
    component: AppMain,
    redirect: '/my/devices/list',
    name: 'myDevices',
    meta: {
      title: 'myDevices',
      icon: 'device',
      privilege: 'myDevices_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/my/devices/list'),
        name: 'myDeviceList',
        meta: {
          title: 'myDeviceList',
          icon: 'device',
          privilege: 'myDevices_list',
        },
      },
    ],
  },
]

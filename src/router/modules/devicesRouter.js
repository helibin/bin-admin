import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/devices',
    component: AppMain,
    redirect: '/devices/list',
    name: 'Devices',
    meta: {
      title: 'devices',
      icon: 'device',
      privilege: 'devices_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/devices/list'),
        name: 'DevicesList',
        meta: {
          title: 'devices',
          icon: 'device',
          privilege: 'devices_list',
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/pages/devices/edit'),
        name: 'EditDevices',
        meta: {
          title: 'editDevices',
          noCache: true,
          privilege: 'devices_modify',
        },
        hidden: true,
      },
    ],
  },
]

import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/my/statistics',
    name: 'myStatistics',
    component: AppMain,
    redirect: '/my/statistics/list',
    meta: {
      title: 'myStatistics',
      icon: 'chart',
      privilege: 'myStatistics_entry',
    },
    children: [
      {
        path: 'order-settlement',
        component: () => import('@/pages/my/statistics/order-settlement'),
        name: 'myOrderSettlement',
        meta: {
          title: 'myOrderSettlement',
          icon: 'order',
          privilege: 'myStatistics_orderSettlement',
        },
      },
    ],
  },
]

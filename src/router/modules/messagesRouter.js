import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/messages',
    component: AppMain,
    name: 'messages',
    meta: {
      title: 'messages',
      icon: 'message',
      privilege: 'messages_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/messages/list'),
        name: 'messagesList',
        meta: {
          title: 'messages',
          icon: 'message',
          privilege: 'messages_list',
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/pages/messages/edit'),
        name: 'editMessages',
        meta: {
          title: 'editMessages',
          icon: 'edit',
          privilege: 'messages_modify',
        },
        hidden: true,
      },
    ],
  },
]

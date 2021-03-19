import AppMain from '@/pages/layout/components/AppMain'

export default [
  {
    path: '/medias',
    component: AppMain,
    redirect: '/medias/list',
    name: '媒体',
    meta: {
      title: 'medias',
      icon: 'media',
      privilege: 'medias_list',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/medias/list'),
        name: 'MediasList',
        meta: {
          title: 'mediasList',
          icon: 'media',
          privilege: 'medias_list',
        },
      },
      {
        path: 'list?cate=banner',
        component: () => import('@/pages/medias/list'),
        name: 'BannerList',
        meta: {
          title: 'bannerList',
          icon: 'media',
          privilege: 'medias_list',
        },
      },
      {
        path: 'list?cate=newHappy',
        component: () => import('@/pages/medias/list'),
        name: 'NewHappyList',
        meta: {
          title: 'newHappyList',
          icon: 'media',
          privilege: 'medias_list',
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/pages/medias/edit'),
        name: 'EditMedias',
        meta: {
          title: 'editMedias',
          noCache: true,
          privilege: 'medias_modify',
        },
        hidden: true,
      },
    ],
  },
]

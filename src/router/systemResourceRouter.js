import Layout from '@/pages/layout/Layout'

// import appsRouter from './modules/appsRouter'
// import couponsRouter from './modules/couponsRouter'
// import healthCaresRouter from './modules/healthCaresRouter'
import mediasRouter from './modules/mediasRouter'
// import newsRouter from './modules/newsRouter'
// import refUserCouponRouter from './modules/refUserCouponRouter'

// import babyChangesRouter from './modules/babyChangesRouter'
// import prepackagesRouter from './modules/prepackagesRouter'
// import ultrasoundGuidesRouter from './modules/ultrasoundGuidesRouter'
// import ultrasoundItemsRouter from './modules/ultrasoundItemsRouter'

// import videoPackagesRouter from './modules/videoPackagesRouter'
// import videoTemplatesRouter from './modules/videoTemplatesRouter'
import noteCatesRouter from './modules/noteCatesRouter'

export default [
  {
    path: '/_systemResource',
    component: Layout,
    name: 'systemResource',
    meta: {
      title: 'systemResource',
      icon: 'document',
      privilege: [
        'apps_list',
        'coupons_list',
        'healthCares_list',
        'medias_list',
        'news_list',
        'refUserCoupon_list',

        'babyChanges_list',
        'prepackages_list',
        'ultrasoundGuides_list',
        'ultrasoundItems_list',

        'videoPackages_list',
        'videoTemplates_list',

        'noteCates_list',
      ],
    },
    children: [
      // ...appsRouter,
      // ...couponsRouter,
      // ...healthCaresRouter,
      ...mediasRouter,
      // ...newsRouter,
      // ...refUserCouponRouter,

      // ...babyChangesRouter,
      // ...prepackagesRouter,
      // ...ultrasoundGuidesRouter,
      // ...ultrasoundItemsRouter,

      // ...videoPackagesRouter,
      // ...videoTemplatesRouter,

      ...noteCatesRouter,
    ],
  },
]

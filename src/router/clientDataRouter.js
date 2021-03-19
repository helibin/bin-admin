import Layout from '@/pages/layout/Layout'

// import babyDataRouter from './modules/babyDataRouter'
// import babysRouter from './modules/babysRouter'
import feedbacksRouter from './modules/feedbacksRouter'
import messagesRouter from './modules/messagesRouter'
// import ordersRouter from './modules/ordersRouter'
import groupsRouter from './modules/groupsRouter'
import quickNotesRouter from './modules/quickNotesRouter'
import noteCatesRouter from './modules/noteCatesRouter'
import noteCommentsRouter from './modules/noteCommentsRouter'

export default [
  {
    path: '/_clientData',
    component: Layout,
    name: 'clientData',
    meta: {
      title: 'clientData',
      icon: 'users',
      privilege: ['feedbacks_list', 'messages_list', 'orders_list'],
    },
    children: [
      // ...babyDataRouter,
      // ...babysRouter,
      ...feedbacksRouter,
      ...messagesRouter,
      ...noteCommentsRouter,
      // ...ordersRouter,
      ...groupsRouter,
      ...quickNotesRouter,
      ...noteCatesRouter,
    ],
  },
]

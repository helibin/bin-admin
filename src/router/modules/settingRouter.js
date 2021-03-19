export default [
  {
    path: 'edit/:id',
    component: () => import('@/pages/settings/edit'),
    name: 'EditApps',
    meta: {
      title: 'editApps',
      noCache: true,
      privilege: 'settings_modify',
    },
    hidden: true,
  },
]

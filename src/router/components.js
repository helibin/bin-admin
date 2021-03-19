/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/pages/layout/Layout'

export default [
  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'ComponentDemo',
    meta: {
      title: 'components',
      icon: 'component',
    },
    children: [
      {
        path: 'datetime-picker',
        component: () => import('@/pages/demo/components-demo/datetimePicker'),
        name: 'datetimePickerDome',
        meta: { title: 'datetimePicker' },
      },
      {
        path: 'tinymce',
        component: () => import('@/pages/demo/components-demo/tinymce'),
        name: 'TinymceDemo',
        meta: { title: 'tinymce' },
      },
      {
        path: 'markdown',
        component: () => import('@/pages/demo/components-demo/markdown'),
        name: 'MarkdownDemo',
        meta: { title: 'markdown' },
      },
      {
        path: 'json-editor',
        component: () => import('@/pages/demo/components-demo/jsonEditor'),
        name: 'JsonEditorDemo',
        meta: { title: 'jsonEditor' },
      },
      {
        path: 'splitpane',
        component: () => import('@/pages/demo/components-demo/splitpane'),
        name: 'SplitpaneDemo',
        meta: { title: 'splitPane' },
      },
      {
        path: 'avatar-upload',
        component: () => import('@/pages/demo/components-demo/avatarUpload'),
        name: 'AvatarUploadDemo',
        meta: { title: 'avatarUpload' },
      },
      {
        path: 'dropzone',
        component: () => import('@/pages/demo/components-demo/dropzone'),
        name: 'DropzoneDemo',
        meta: { title: 'dropzone' },
      },
      {
        path: 'sticky',
        component: () => import('@/pages/demo/components-demo/sticky'),
        name: 'StickyDemo',
        meta: { title: 'sticky' },
      },
      {
        path: 'count-to',
        component: () => import('@/pages/demo/components-demo/countTo'),
        name: 'CountToDemo',
        meta: { title: 'countTo' },
      },
      {
        path: 'mixin',
        component: () => import('@/pages/demo/components-demo/mixin'),
        name: 'ComponentMixinDemo',
        meta: { title: 'componentMixin' },
      },
      {
        path: 'back-to-top',
        component: () => import('@/pages/demo/components-demo/backToTop'),
        name: 'BackToTopDemo',
        meta: { title: 'backToTop' },
      },
      {
        path: 'drag-dialog',
        component: () => import('@/pages/demo/components-demo/dragDialog'),
        name: 'DragDialogDemo',
        meta: { title: 'dragDialog' },
      },
      {
        path: 'dnd-list',
        component: () => import('@/pages/demo/components-demo/dndList'),
        name: 'DndListDemo',
        meta: { title: 'dndList' },
      },
      {
        path: 'drag-kanban',
        component: () => import('@/pages/demo/components-demo/dragKanban'),
        name: 'DragKanbanDemo',
        meta: { title: 'dragKanban' },
      },
    ],
  },
]

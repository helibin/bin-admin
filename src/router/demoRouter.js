import AppMain from '@/pages/layout/components/AppMain'
import Layout from '@/pages/layout/Layout'

export default [
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/zip',
    name: 'Demo',
    meta: {
      title: 'demo',
      icon: 'example',
    },
    children: [
      {
        path: '/excel',
        component: AppMain,
        redirect: '/excel/export-excel',
        name: 'Excel',
        meta: {
          title: 'excel',
          icon: 'excel',
        },
        children: [
          {
            path: 'export-excel',
            component: () => import('@/pages/demo/excel/exportExcel'),
            name: 'ExportExcel',
            meta: { title: 'exportExcel' },
          },
          {
            path: 'export-selected-excel',
            component: () => import('@/pages/demo/excel/selectExcel'),
            name: 'SelectExcel',
            meta: { title: 'selectExcel' },
          },
          {
            path: 'upload-excel',
            component: () => import('@/pages/demo/excel/uploadExcel'),
            name: 'UploadExcel',
            meta: { title: 'uploadExcel' },
          },
        ],
      },
      {
        path: '/zip',
        component: AppMain,
        redirect: '/zip/download',
        alwaysShow: true,
        meta: {
          title: 'zip',
          icon: 'zip',
        },
        children: [
          {
            path: 'download',
            component: () => import('@/pages/demo/zip/index'),
            name: 'ExportZip',
            meta: { title: 'exportZip' },
          },
        ],
      },
      {
        path: '/theme',
        component: AppMain,
        redirect: 'noredirect',
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/theme/index'),
            name: 'Theme',
            meta: {
              title: 'theme',
              icon: 'theme',
            },
          },
        ],
      },
      {
        path: '/clipboard',
        component: AppMain,
        redirect: 'noredirect',
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/clipboard/index'),
            name: 'ClipboardDemo',
            meta: {
              title: 'clipboardDemo',
              icon: 'clipboard',
            },
          },
        ],
      },
      {
        path: '/i18n',
        component: AppMain,
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/i18n-demo/index'),
            name: 'I18n',
            meta: {
              title: 'i18n',
              icon: 'international',
            },
          },
        ],
      },
      {
        path: 'external-link',
        component: AppMain,
        children: [
          {
            path: 'https://github.com/PanJiaChen/vue-element-admin',
            meta: {
              title: 'externalLink',
              icon: 'link',
            },
          },
        ],
      },
      {
        path: '/tab',
        component: AppMain,
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/tab/index'),
            name: 'Tab',
            meta: { title: 'tab', icon: 'tab' },
          },
        ],
      },
      {
        path: '/error',
        component: AppMain,
        redirect: 'noredirect',
        name: 'ErrorPages',
        meta: {
          title: 'errorPages',
          icon: '404',
        },
        children: [
          {
            path: '401',
            component: () => import('@/pages/demo/errorPage/401'),
            name: 'Page401',
            meta: { title: 'page401', noCache: true },
          },
          {
            path: '404',
            component: () => import('@/pages/demo/errorPage/404'),
            name: 'Page404',
            meta: { title: 'page404', noCache: true },
          },
        ],
      },
      {
        path: '/error-log',
        component: AppMain,
        redirect: 'noredirect',
        children: [
          {
            path: 'log',
            component: () => import('@/pages/demo/errorLog/index'),
            name: 'ErrorLog',
            meta: { title: 'errorLog', icon: 'bug' },
          },
        ],
      },
      {
        path: '/documentation',
        component: AppMain,
        redirect: '/documentation/index',
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/documentation/index'),
            name: 'Documentation',
            meta: {
              title: 'documentation',
              icon: 'documentation',
              noCache: true,
            },
          },
        ],
      },
      {
        path: '/icon',
        component: AppMain,
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/svg-icons/index'),
            name: 'Icons',
            meta: {
              title: 'icons',
              icon: 'icon',
              noCache: true,
            },
          },
        ],
      },
      {
        path: '/guide',
        component: AppMain,
        redirect: '/guide/index',
        children: [
          {
            path: 'index',
            component: () => import('@/pages/demo/guide/index'),
            name: 'Guide',
            meta: {
              title: 'guide',
              icon: 'guide',
              noCache: true,
            },
          },
        ],
      },
      {
        path: '/permission',
        component: AppMain,
        redirect: '/permission/index',
        alwaysShow: true, // will always show the root menu
        meta: {
          title: 'permission',
          icon: 'lock',
          roles: ['admin', 'editor'], // you can set roles in root nav
        },
        children: [
          {
            path: 'page',
            component: () => import('@/pages/demo/permission/page'),
            name: 'PagePermission',
            meta: {
              title: 'pagePermission',
              roles: ['admin'], // or you can only set roles in sub nav
            },
          },
          {
            path: 'directive',
            component: () => import('@/pages/demo/permission/directive'),
            name: 'DirectivePermission',
            meta: {
              title: 'directivePermission',
              // if do not set roles, means: this page does not require permission
            },
          },
        ],
      },
    ],
  },
]

import TabsView from '@/layouts/tabs/TabsView'
// import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'information',
          name: '资讯',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '资讯列表',
              component: () => import('@/pages/infomationList/index'),
            }
          ]
        },
        {
          path: 'product',
          name: '商品',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '商品列表',
              component: () => import('@/pages/productList/index'),
            }
          ]
        },{
          path: 'fileDown',
          name: '文件下载',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '文件下载列表',
              component: () => import('@/pages/fileDownList/index'),
            }
          ]
        },{
          path: 'studyVideo',
          name: '教学视频',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '教学视频列表',
              component: () => import('@/pages/studyVideoList/index'),
            }
          ]
        },{
          path: 'qa',
          name: 'Q&A',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '留言列表',
              component: () => import('@/pages/qaList/index'),
            }
          ]
        }
      ]
    },
  ]
}

export default options

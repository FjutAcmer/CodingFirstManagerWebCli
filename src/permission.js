import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已经登陆
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登陆，重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断权限生成路由（暂未开发，默认生成所有路由表）
      try {
        const accessRoutes = await store.dispatch('permission/generateRoutes', 'admin')
        // 动态生成路由
        router.addRoutes(accessRoutes)

        next({ ...to, replace: true })
      } catch (error) {
        // 移除token并重定向至登陆页面
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果要跳转的页面在白名单里，直接跳转
      next()
    } else {
      // 其他页面则重定向至登陆页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

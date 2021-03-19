import Mock from 'mockjs'
import loginAPI from './login'
import newsAPI from './news'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 资讯相关
Mock.mock(/\/news\/list/, 'get', newsAPI.getList)
Mock.mock(/\/news\/detail/, 'get', newsAPI.getNews)
Mock.mock(/\/news\/pv/, 'get', newsAPI.getPv)
Mock.mock(/\/news\/create/, 'post', newsAPI.createNews)
Mock.mock(/\/news\/update/, 'post', newsAPI.updateNews)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock

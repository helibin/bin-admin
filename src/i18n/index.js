import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  'en-US': {
    ...enLocale,
    ...elementEnLocale,
  },
  'zh-CN': {
    ...zhLocale,
    ...elementZhLocale,
  },
}

const i18n = new VueI18n({
  // set locale
  // options: en-US or zh-CN
  locale: Cookies.get('_locale') || 'zh-CN',
  // set locale messages
  messages,
})

export default i18n

import store from '@/store'

export default {
  inserted(el, binding) {
    const { value } = binding
    const privileges = store.getters && store.getters.privileges

    if (['*', ''].includes(privileges)) return

    const privilegeArr = privileges.replace(' ', '').split(',')
    if (value && value instanceof Array && value.length > 0) {
      const privilege = value

      if (!privilegeArr.some(p => privilege.includes(p))) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('need privileges! Like v-permission="[\'news_list\']"')
    }
  },
}

import store from '@/store'

export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const privileges = store.getters && store.getters.privileges
    const permissionRoles = value

    const hasPermission = privileges.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error("need privileges! Like v-permission=\"['admin','editor']\"")
    return false
  }
}

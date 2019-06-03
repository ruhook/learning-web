import { debounce } from '../utils'

export const debounceDirective = {
  bind(el, { value }, vnode) {
    const [target, time] = value
    const debounced = debounce(target, time, vnode)
    el.addEventListener('click', debounced)
    el._debounced = debounced
  },
  destroy(el) {
    el.removeEventListener('click', el._debounced)
  }
}
<script>
import { debounce } from '../utils'

export default {
  name: 'Debounce',
  abstract: true,  // 抽象组件
  props: {
    time: {
      type: Number,
      default: 300
    },
    events: {
      type: String
    }
  },
  created () {
    this.eventKeys = this.events.split(',')  // 需要代理的事件
    this.originMap = {}  // 缓存执行体
    this.debouncedMap = {} // 缓存被防抖处理完的执行体
  },
  render (h) {
    const vnode = this.$slots.default ? this.$slots.default[0] : null
    if (this.eventKeys.length === 0) console.error('未传入需要防抖的事件~')
    this.eventKeys.forEach(event => {
      console.log(vnode.data)
      const target = vnode.data.on ? vnode.data.on[event] : null
      if (target)      {
        this.originMap[event] = target
        this.debouncedMap[event] = debounce(target, this.time, vnode)
        vnode.data.on[event] = this.debouncedMap[event]
      }
    })
    return vnode
  },
}
</script>

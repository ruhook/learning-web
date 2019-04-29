import { Store, install } from './store'
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'

export default {
  Store,    // vuex 实例
  install,  // 安装插件
  version: '__VERSION__',
  mapState,     //  state 语法糖
  mapMutations,   // 
  mapGetters,    //
  mapActions,    //
  createNamespacedHelpers   //  命名空间
}

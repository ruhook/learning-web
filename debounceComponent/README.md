# vue 中的防抖（debounce） 节流应用（throttling）



## component

引入

```
import { debounceComponent } from './directive/debounce'
Vue.component('debounce', debounceComponent)
```


组件使用

```
<debounce :time="500" events="click">
  <button class="btn" @click="event($event, 2)">组件包裹</button>
</debounce>
```

## directive
引入

```
import { debounceDirective } from './directive/debounce'
Vue.directive('debounce', debounceDirective)
```
组件使用

```
<button class="btn" v-debounce="[($event) => { event($event, 4) }, 500, 'click']">指令处理</button>
```
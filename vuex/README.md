# Vuex - 个人阅读


<p align="center">
  <img width="700px" src="http://pic-bccf.oss-cn-beijing.aliyuncs.com/ruhook/vuex.jpg">
</p>

## 超低配版 vuex
> html
``` 
<div id="app">
  {{state.test}}
</div>
``` 
> js
``` 
let state = {
  test: "123"
}
state._vm = new Vue({
  data() {
    return {
      $$state: state
    }
  }
})

let vm = new Vue({
  el: '#app',
  data() {
    return {
      state
    }
  }
})


setTimeout(() => {
  console.log(456)
  state.test = '456'
}, 1000);
```

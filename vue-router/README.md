# vue-router - 个人阅读
---

<p align="center">
  <img width="700px" src="http://pic-bccf.oss-cn-beijing.aliyuncs.com/ruhook/router.jpg">
</p>

## 收获
  
1、核心点是在于defineReactive(this, '_route', this._router.history.current) ， 可以每次去setter的时候去触发组件的重新渲染。
2、通过mode  之后 再验证 this.history 去获得 history 实例 （HTML5、Hash 和 Abstract[node]）, base.js 的核心方法 transtionTo（内部会通过matcher来匹配路由）， 路由的push  或者  router-link 绑定的点击事件 都是通过它来跳转的 。
# 简易版 EventEmitter 实现


英语渣，以前都是 观察者 / 订阅发布的叫过来叫过去， 有次朋友说EventEmitter 你会吗，我说不会啊。然后就被鄙视了一波。（主要一看英文感觉好牛逼，咳咳咳） 。 然后我去一看 ， 麻蛋 ， 这不就是我熟知的吗...   然后， 手动封装一波吧。

---
### api 
event : on | once | emit | addListener | removeListener



```
let event = new EventEmitter()

event.on(type, handle)   // 绑定事件
event.once(type, handle)   // 单次绑定事件
event.addListener(type, handle)  // _events 尾部添加事件  等价于 on
event.removeListener(type, handle)  //  移除_events[type]里符合的handle,  handle可以不传。 直接移除_events[type]

event.emit(type, ...args)  // 触发事件。 
```
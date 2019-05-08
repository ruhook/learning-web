#  回调函数时间轴学习

---

### 回调函数的缺点 
> 1、不可以return

> 2、try catch 捕获不到， 因为回调函数异步 ， 但是下方函数执行为同步

>3、回调地狱 node 里面能写到爆炸
```
1、EventEmitter可以解决一波 。
2、哨兵函数
```

### generator  fn*()
```
let fn = function *(arg1)
fn.next(arg2)
fn.next(arg3)
```
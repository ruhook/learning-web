#  回调函数时间轴学习

### 回调函数的缺点 
> 1、不可以return

> 2、try catch 捕获不到， 因为回调函数异步 ， 但是下方函数执行为同步

>3、回调地狱 node 里面能写到爆炸
```
1、EventEmitter可以解决一波 。
2、哨兵函数
```
---

### generator  fn*()

创建一个迭代器，。  可以 next  执行。
```
let fn = function *(arg1)
fn.next(arg2)
fn.next(arg3)
```
---
### promise 

最直接的理解

[手动实现一波](https://github.com/ruhook/my-promise)

---
### async await 

async函数返回一个 Promise 对象，可以使用then方法添加回调函数。

generator的语法糖。Generator+自动执行器 （co.js）简单实现就是递归执行 next 去判断 done 的状态 。

```
function run(g){
  var res = g.next(); //res.value是个promise对象
  if(!res.done){
    res.value.then(()=>{   //promise解决了才继续执行生成器内部函数
      run(g);
    })  
  }
}
```


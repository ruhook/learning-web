// 防抖 
export const debounce = (func, time, ctx) => {
  let timer = null

  return (...params) => {
    console.log(params)
    // 只能接收到  $event ,待我看完 深入浅出 再来  猜测是 vue 事件处理 统一形式 ($event)=>{ retrurn func }
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(ctx, params);
    }, time);
  }
}

// 节流
export const throttle = (func, time, ctx) => {
  let wait = false
  return (...params) => {
    if (!wait) {
      wait = true;
      setTimeout(function() {
        func.apply(ctx, params);
        wait = false;
      }, time);
    }
  }
}
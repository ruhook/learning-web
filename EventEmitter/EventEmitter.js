/**
 * 发布 + 订阅
 */

class EventEmitter {
  constructor() {
    this._events = Object.create(null)

  }
  addListener(type, hander) {
    this.on(type, hander)
  }

  removeListener(type, hander) {
    if (!this._events[type]) return
    if (!hander) {
      this._events[type].length = 0
      return
    }
    if (this._events[type].indexOf(hander) === -1) return
    this._events[type].splice(this._events[type].indexOf(hander, 1))
  }

  on(type, hander) {
    if (!this._events[type]) this._events[type] = []
    this._events[type].push(hander)
  }

  once(type, hander) {
    let flag = false

    let warp = () => {
      hander.apply(this, arguments)
      this.removeListener(type, warp)
    }
    this.on(type, warp)
  }

  emit(type) {
    let payload = [].slice.call(arguments, 1)
    let events = this._events[type] || []
    events.forEach(handler => {
      handler.apply(this, payload)
    });
  }
}
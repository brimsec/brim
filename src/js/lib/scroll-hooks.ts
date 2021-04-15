export default class ScrollHooks {
  static create(start: Function, stop: Function) {
    let scrolling = false
    let timeout

    return () => {
      if (!scrolling) {
        scrolling = true
        start()
      } else {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        scrolling = false
        stop()
      }, 150)
    }
  }
}

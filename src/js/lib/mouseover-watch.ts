type Cond = (arg0: [number, number]) => boolean
type Callback = () => void
type Cords = [number, number]
type StateEnum = "IN" | "OUT" | "EXITING"

export default class MouseoverWatch {
  isWithin: Cond
  onEnterCb: Callback
  onExitCb: Callback
  state: StateEnum = "OUT"
  delay = 0
  tid: number

  constructor() {
    this.isWithin = ([_x, _y]) => false
    this.onEnterCb = () => {}
    this.onExitCb = () => {}
  }

  addListener() {
    document.addEventListener("mousemove", this.listener)
    const bod = document.body
    bod && bod.addEventListener("mouseleave", this.startExit)
    return this
  }

  removeListener() {
    document.removeEventListener("mousemove", this.listener)
    const bod = document.body
    bod && bod.removeEventListener("mouseleave", this.startExit)
    return this
  }

  listener = (e: MouseEvent) => {
    this.run([e.pageX, e.pageY])
  }

  run(cords: Cords) {
    if (this.isWithin(cords)) {
      switch (this.state) {
        case "OUT":
          this.enter()
          break
        case "EXITING":
          clearTimeout(this.tid)
          this.state = "IN"
          break
      }
    } else {
      switch (this.state) {
        case "IN":
          this.startExit()
          break
      }
    }
    return this
  }

  enter = () => {
    this.state = "IN"
    this.onEnterCb()
  }

  exit = () => {
    this.state = "OUT"
    this.onExitCb()
  }

  startExit = () => {
    if (this.delay > 0) {
      this.state = "EXITING"
      this.tid = setTimeout(() => this.exit(), this.delay)
    } else {
      this.exit()
    }
  }

  // Setters

  condition(cond: Cond) {
    this.isWithin = cond
    return this
  }

  onEnter(cb: Callback) {
    this.onEnterCb = cb
    return this
  }

  onExit(cb: Callback) {
    this.onExitCb = cb
    return this
  }

  exitDelay(ms: number) {
    this.delay = ms
    return this
  }
}

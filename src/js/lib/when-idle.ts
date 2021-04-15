import onIdle from "on-idle"

interface IdleFunc {
  (...args: any): any
  cancel: () => void
}

export default function whenIdle(func: Function): IdleFunc {
  let _cancel = () => {}

  const lazy = function(...args: any) {
    _cancel()
    _cancel = onIdle(() => func(...args))
  }

  lazy.cancel = _cancel
  return lazy
}

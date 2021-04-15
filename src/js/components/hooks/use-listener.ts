import {useEffect, useRef} from "react"

export default function useListener(
  el: Node | null | undefined,
  event: string,
  callback: EventListener,
  opts: boolean | Object = false
) {
  const savedCallback = useRef<EventListener>(() => {})

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const listener = (e) => savedCallback.current(e)
    el && el.addEventListener(event, listener, opts)
    return () => {
      if (el) el.removeEventListener(event, listener, opts)
    }
  }, [el, event])
}

import {useEffect} from "react"

export default function useEventListener(
  el: EventTarget,
  name: string,
  callback: EventListenerOrEventListenerObject,
  deps: any[] | null | undefined
) {
  useEffect(() => {
    el.addEventListener(name, callback, false)
    return () => el.removeEventListener(name, callback, false)
  }, deps)
}

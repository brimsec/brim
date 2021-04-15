import {useLayoutEffect, useRef} from "react"

export default function useLayoutUpdate(fn, deps) {
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
    } else {
      fn()
    }
  }, deps)
}

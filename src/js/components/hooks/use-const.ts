import {useLayoutEffect, useRef} from "react"

export default function useConst<T>(init: T, fn: () => T): T {
  const ref = useRef(init)

  useLayoutEffect(() => {
    ref.current = fn()
  }, [])

  return ref.current
}

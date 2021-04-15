import {useEffect, useRef, useState} from "react"

export default function(value: any, wait: number) {
  const [state, setState] = useState(value)
  const timeout = useRef(null)
  const pending = useRef(false)
  const nextValue = useRef(null)

  const cancel = () => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = undefined
      pending.current = false
    }
  }

  useEffect(() => {
    if (!timeout.current) {
      setState(value)

      const callback = () => {
        if (pending.current) {
          pending.current = false
          setState(nextValue.current)
          timeout.current = setTimeout(callback, wait)
        } else {
          timeout.current = undefined
        }
      }

      timeout.current = setTimeout(callback, wait)
    } else {
      pending.current = true
      nextValue.current = value
    }
  }, [value])

  return [state, cancel]
}

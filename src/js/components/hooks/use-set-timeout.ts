import {useEffect, useRef} from "react"

export default function useSetTimeout() {
  const timers = useRef([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (fn: Function, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }
}

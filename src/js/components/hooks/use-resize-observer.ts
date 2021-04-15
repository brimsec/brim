import {useLayoutEffect, useRef, useState} from "react"

export type Rect = {width: number; height: number; x: number; y: number}

export function useResizeObserver() {
  const ref = useRef()
  const [rect, setRect] = useState<Rect>({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })

  function onResize(entries) {
    const {x, y, width, height} = entries[0].contentRect
    setRect({x, y, width, height})
  }

  useLayoutEffect(() => {
    let obs
    if (ref.current) {
      obs = new ResizeObserver(onResize)
      obs.observe(ref.current)
    }
    return () => obs && obs.disconnect()
  }, [ref.current])

  return {ref, rect}
}

import React, {useRef} from "react"

export type DragArgs = {dx: number; dy: number}

export default function useDrag(dragHandler: (args: DragArgs) => void) {
  const start = useRef({x: 0, y: 0})

  const onMouseDown = (e: React.MouseEvent) => {
    start.current = {x: e.clientX, y: e.clientY}
    document.body.addEventListener("mousemove", onMouseMove)
    document.body.addEventListener("mouseup", onMouseUp)
    document.body.addEventListener("mouseleave", onMouseUp)
  }

  const onMouseUp = () => {
    document.body.removeEventListener("mousemove", onMouseMove)
    document.body.removeEventListener("mouseup", onMouseUp)
    document.body.removeEventListener("mouseleave", onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    const dy = e.clientY - start.current.y
    const dx = e.clientX - start.current.x
    dragHandler({dy, dx})
  }

  return onMouseDown
}

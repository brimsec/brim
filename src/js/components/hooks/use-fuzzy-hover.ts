import {useRef, useState} from "react"

export default function useFuzzyHover(enterDelay: number, exitDelay: number) {
  const [hovering, setHovering] = useState(false)
  const exitId = useRef(null)
  const enterId = useRef(null)

  function mouseEnter() {
    cancelExit()
    scheduleEnter()
  }

  function mouseLeave() {
    cancelEnter()
    scheduleExit()
  }

  function scheduleExit() {
    exitId.current = setTimeout(() => setHovering(false), exitDelay)
  }

  function scheduleEnter() {
    enterId.current = setTimeout(() => setHovering(true), enterDelay)
  }

  function cancelEnter() {
    clearTimeout(enterId.current)
  }

  function cancelExit() {
    clearTimeout(exitId.current)
  }

  return {
    mouseEnter,
    mouseLeave,
    hovering
  }
}

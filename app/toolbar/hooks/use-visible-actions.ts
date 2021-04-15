import useContentRect from "app/core/hooks/use-content-rect"
import {useLayoutEffect, useState} from "react"
import useCallbackRef from "src/js/components/hooks/use-callback-ref"
import {GUTTER} from "../action-buttons"

export default function useVisibleActions(actions) {
  const [visible, setVisible] = useState([])
  const [hidden, setHidden] = useState([])
  const [fullWidth, setFullWidth] = useState(0)
  const [measure, setMeasure] = useCallbackRef()
  const [rect, setParent] = useContentRect()
  const actualWidth = Math.ceil(rect.width) + GUTTER

  useLayoutEffect(() => {
    let widths = []
    if (measure) {
      setFullWidth(measure.clientWidth)
      widths = Array.from(measure.children).map((c) => c.clientWidth)
    }

    let offset = 0
    let index = 0
    for (let childWidth of widths) {
      offset += childWidth + GUTTER
      if (offset > actualWidth) break
      index++
    }
    const copy = [...actions]
    const nextHidden = copy.splice(index)
    setVisible(copy)
    setHidden(nextHidden)
  }, [actions, measure, actualWidth])

  return {visible, hidden, fullWidth, setMeasure, setParent}
}

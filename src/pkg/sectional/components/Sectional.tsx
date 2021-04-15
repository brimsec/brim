import React, {MouseEvent, useLayoutEffect, useRef, useState} from "react"
import {SectionData} from "../models/Section"
import Controller from "../models/Controller"
import useDrag, {DragArgs} from "../hooks/use-drag"
import useResizeObserver from "../hooks/use-resize-observer"
import {Provided} from "../types"

type Props = {
  sections: SectionData[]
  children: (data: SectionData, provided: Provided) => React.ReactNode
  onChange: (views: SectionData[]) => void
}

export function Sectional({sections, children, onChange}: Props) {
  const ref = useRef(null)
  const {height: size} = useResizeObserver(ref)
  const snapshot = useRef(sections)
  const dragIndex = useRef(0)
  const [animate, setAnimate] = useState(false)
  const ctl = Controller.parse({size, sections})

  function update(ctl: Controller) {
    onChange(ctl.serialize().sections)
  }

  function resize() {
    setAnimate(false)
    update(Controller.parse({size, sections}))
  }

  function toggle(index: number) {
    setAnimate(true)
    const ctl = Controller.parse({size, sections})
    ctl.toggle(index)
    update(ctl)
  }

  function dragStart(index: number) {
    setAnimate(false)
    snapshot.current = sections
    dragIndex.current = index
  }

  function drag({dy}: DragArgs) {
    const sections = snapshot.current
    const ctl = Controller.parse({size, sections})
    ctl.drag(dragIndex.current, dy)
    update(ctl)
  }

  function getStyle(index: number) {
    return {
      ...ctl.at(index).getStyle(),
      transition: animate ? "height 300ms" : "none"
    }
  }

  useLayoutEffect(resize, [size])
  const bindDrag = useDrag(drag)

  return (
    <div ref={ref} style={{width: "100%", height: "100%"}}>
      {ctl.map((data, index) =>
        children(data, {
          style: getStyle(index),
          toggleProps: {
            onClick: () => toggle(index)
          },
          resizeProps: {
            onMouseDown: (e: MouseEvent) => {
              dragStart(index)
              bindDrag(e)
            },
            style: {
              cursor: ctl.getCursor(index)
            }
          }
        })
      )}
    </div>
  )
}

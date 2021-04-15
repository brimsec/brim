import {isEqual} from "lodash"
import {render} from "react-dom"
import {select, mouse, ContainerElement} from "d3"
import React from "react"

import {HistogramDataPoint} from "../MainHistogram/format"
import {Pen} from "../types"
import {getPointAt} from "../get-point-at"

type Args = {
  wrapperClassName: string
  render: any
}

export default function({wrapperClassName, render: Component}: Args): Pen {
  let div
  let svg
  let lastPoint

  function hide() {
    div.style.opacity = "0"
  }

  function mount(el) {
    svg = el
    div = document.createElement("div")
    div.classList.add(wrapperClassName)
    if (svg.parentNode) svg.parentNode.appendChild(div)

    select(svg)
      .select(".brush")
      .on("mousedown.tooltip", hide)
  }

  function draw(chart) {
    function show() {
      if (chart.state.isDragging) return hide()

      const [left] = mouse(svg)
      const point = getPointAt(left, chart)

      if (point && point.count) {
        positionTooltip(div, svg, 30)
        if (!isEqual(lastPoint, point)) {
          render(<Component {...getProps(point)} />, div)
        }
        lastPoint = point
      } else {
        hide()
      }
    }

    select(svg)
      .select(".brush")
      .on("mouseout.tooltip", hide)
      .on("mousemove.tooltip", show)
  }

  return {mount, draw}
}

const getProps = (point: HistogramDataPoint) => {
  const segments = []
  const paths = point.paths
  for (const key in paths) {
    if (paths[key] !== 0) segments.push([key, paths[key]])
  }

  return {ts: point.ts, segments}
}

export const positionTooltip = (
  el: HTMLElement,
  parent: ContainerElement,
  padding: number
) => {
  const [left] = mouse(parent)
  const {width} = el.getBoundingClientRect()
  const {width: parentWidth} = parent.getBoundingClientRect()

  select(el)
    .style("left", xPosition(left, width, parentWidth, padding))
    .style("opacity", "1")
}

export const xPosition = (
  left: number,
  width: number,
  parentWidth: number,
  padding: number
) => {
  if (left + width + padding >= parentWidth) {
    return left - width - padding + "px"
  } else {
    return left + padding + "px"
  }
}

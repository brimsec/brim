import {isEqual} from "lodash"
import * as d3 from "d3"

import {DateSpan, Pen} from "../types"
import {duration, shift} from "../../../lib/time-window"
import {innerWidth} from "../dimens"

type Props = {
  onDragEnd: (arg0: DateSpan) => void
}

export default function({onDragEnd}: Props): Pen {
  let startSpan = null
  let startPos = null
  let xAxis
  let dragArea

  function mount(svg) {
    xAxis = d3
      .select(svg)
      .append("g")
      .attr("class", "x-axis")

    // Make the invisible rect the size of the x axis to listen for the drag
    dragArea = xAxis
      .append("rect")
      .attr("class", "x-axis-drag")
      .attr("fill", "transparent")
  }

  function draw(chart, redraw) {
    function getXPos() {
      return d3.mouse(xAxis.node())[0]
    }

    function addListeners() {
      d3.select("body")
        .on("mousemove", drag, true)
        .on("mouseup", dragEnd)
    }

    function removeListeners() {
      d3.select("body")
        .on("mousemove", null)
        .on("mouseup", null)
    }

    function draggedSpan(chart, _startX, startSpan): DateSpan {
      const pos = getXPos()
      const [from, to] = [pos, startPos].map(chart.xScale.invert)
      const diff = duration([from, to])
      return shift(startSpan, diff)
    }

    function dragEnd() {
      if (startPos === null || startSpan === null) return
      removeListeners()
      onDragEnd(draggedSpan(chart, startPos, startSpan))
      chart.state.isDragging = false
      startPos = null
      startSpan = null
    }

    function drag() {
      if (startPos === null || startSpan === null) return
      const nextSpan = draggedSpan(chart, startPos, startSpan)
      const currSpan = chart.xScale.domain()
      if (!isEqual(nextSpan, currSpan)) {
        chart.xScale.domain(nextSpan)
        redraw(chart)
      }
    }

    function dragStart() {
      startPos = getXPos()
      startSpan = chart.data.span
      chart.state.isDragging = true
      addListeners()
    }

    const x = chart.margins.left
    const y = chart.height - chart.margins.bottom
    xAxis
      .attr("transform", `translate(${x}, ${y})`)
      .call(d3.axisBottom(chart.xScale))

    dragArea
      .attr("width", innerWidth(chart.width, chart.margins))
      .attr("height", chart.margins.bottom)
      .on("mousedown", dragStart)
  }

  return {mount, draw}
}

import * as d3 from "d3"

import {Pen} from "../types"
import {innerHeight} from "../dimens"

export default function(): Pen {
  let line
  const overflow = 10
  let svg

  function mount(el) {
    svg = el
    line = d3
      .select(svg)
      .insert("rect")
      .attr("class", "hover-line")
      .style("pointer-events", "none")
      .style("display", "none")
      .attr("width", "1px")
  }

  function draw(chart) {
    line.attr("height", innerHeight(chart.height, chart.margins) + overflow * 2)

    function hide() {
      line.style("display", "none")
    }

    function show() {
      if (chart.state.isDragging) return hide()

      const [x] = d3.mouse(this)
      if (x < chart.margins.left) {
        line.style("display", "none")
      } else {
        line
          .attr("transform", `translate(${x}, ${chart.margins.top - overflow})`)
          .style("display", "block")
      }
    }

    d3.select(svg)
      .on("mouseout.hoverline", hide)
      .on("mousemove.hoverline", show)
      .on("mousedown.hoverline", hide)
  }

  return {mount, draw}
}

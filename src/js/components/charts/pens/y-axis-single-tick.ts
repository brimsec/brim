import * as d3 from "d3"

import {Pen} from "../types"

export default function(): Pen {
  let yaxis

  function mount(svg) {
    yaxis = d3
      .select(svg)
      .append("g")
      .attr("class", "y-axis-single-tick")
  }

  function draw(chart) {
    if (chart.data.points.length === 0) {
      yaxis.style("opacity", "0")
      return
    }

    yaxis
      .attr(
        "transform",
        `translate(${chart.margins.left}, ${chart.margins.top})`
      )
      .style("opacity", "1")
      .call(d3.axisLeft(chart.yScale).tickValues(chart.yScale.domain()))
  }

  return {mount, draw}
}

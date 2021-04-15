import * as d3 from "d3"

import {Pen} from "../types"
import {getPointAt} from "../get-point-at"
import brim from "../../../brim"

type Props = {
  onFocus: Function
}

export default function({onFocus}: Props): Pen {
  let svg

  function mount(el) {
    svg = el
  }

  function draw(chart) {
    d3.select(svg)
      .select(".brush")
      .on("click.focusbar", () => {
        const data = getPointAt(d3.event.offsetX, chart)
        if (data) {
          const {number, unit} = chart.data.interval
          onFocus([
            data.ts,
            brim
              .time(data.ts)
              .add(number, unit)
              .toDate()
          ])
        }
      })
    // Clicking the focus bar off is handled x axis brush
  }

  return {draw, mount}
}

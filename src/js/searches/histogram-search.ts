import {DateSpan} from "../components/charts/types"
import histogramInterval from "../lib/histogram-interval"

export function addEveryCountProc(program: string, span: DateSpan) {
  const BOOM_INTERVALS = {
    millisecond: "ms",
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
    week: "w",
    year: "y"
  }
  const {number, unit} = histogramInterval(span)

  return program + ` | every ${number}${BOOM_INTERVALS[unit]} count() by _path`
}

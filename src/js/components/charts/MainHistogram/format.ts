import {ChartData} from "../../../state/Chart/types"
import {DateTuple} from "../../../lib/time-window"
import {HistogramData} from "../../charts/types"
import histogramInterval from "../../../lib/histogram-interval"

export type HistogramDataPoint = {
  ts: Date
  paths: {
    [key: string]: number
  }
  count: number
}

export default function(data: ChartData, span: DateTuple): HistogramData {
  const interval = histogramInterval(span)

  const defaults: {
    [key: string]: number
  } = data.keys.reduce((obj, path) => ({...obj, [path]: 0}), {})

  const bins = []
  Object.keys(data.table).map((ms) => {
    // Some data might be out of range
    const ts = new Date(parseInt(ms))
    if (ts >= span[0] && ts < span[1]) {
      bins.push({
        ts,
        paths: {
          ...defaults,
          ...data.table[ms]
        },
        count: Object.values(data.table[ms]).reduce((c, sum) => sum + c, 0)
      })
    }
  })

  return {
    interval,
    span,
    points: bins,
    keys: data.keys
  }
}

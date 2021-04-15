import {ChartData, CHART_CLEAR, CHART_RECORDS, CHART_STATUS} from "./types"
import {SearchStatus} from "../../types/searches"
import MergeHash from "../../models/merge-hash"
import UniqArray from "../../models/uniq-array"
import {zng} from "zealot"

export default {
  setStatus: (tabId: string, status: SearchStatus): CHART_STATUS => ({
    type: "CHART_STATUS",
    status,
    tabId
  }),
  appendRecords: (tabId: string, records: zng.Record[]): CHART_RECORDS => ({
    type: "CHART_RECORDS",
    data: histogramFormat(records),
    tabId
  }),
  clear: (tabId?: string): CHART_CLEAR => ({type: "CHART_CLEAR", tabId})
}

function histogramFormat(records: zng.Record[]): ChartData {
  const paths = new UniqArray()
  const table = new MergeHash()

  records.forEach((r) => {
    const [ts, path, count] = r.getValue() as zng.Primitive[]

    try {
      const pathName = path.toString()
      const key = ts.toDate().getTime()
      const val = {[path.toString()]: count.toInt()}

      table.merge(key, val)
      paths.push(pathName)
    } catch (e) {
      console.log("Error rendering histogram: " + e.toString())
    }
  })

  return {
    table: table.toJSON(),
    keys: paths.toArray()
  }
}

import {createSelector} from "reselect"

import {State} from "../types"
import {TabState} from "../Tab/types"
import {LogDetailHistory, toHistory} from "./reducer"
import activeTabSelect from "../Tab/active-tab-select"
import {LogDetailsState} from "./types"
import {SearchStatus} from "src/js/types/searches"
import {zng} from "zealot"

const getLogDetails = activeTabSelect((state: TabState) => {
  return state.logDetails
})

const getHistory = createSelector<State, LogDetailsState, LogDetailHistory>(
  getLogDetails,
  (logDetails) => toHistory(logDetails)
)

const build = createSelector<State, LogDetailHistory, zng.Record | null>(
  getHistory,
  (history) => {
    const entry = history.current()
    if (entry && entry.log) {
      return zng.Record.deserialize(entry.log)
    } else {
      return null
    }
  }
)

const getUidLogs = createSelector<State, LogDetailHistory, zng.Record[]>(
  getHistory,
  (history) => {
    const entry = history.current()
    return entry
      ? entry.uidLogs.map((data) => zng.Record.deserialize(data))
      : []
  }
)

const getUidStatus = createSelector<State, LogDetailHistory, SearchStatus>(
  getHistory,
  (history) => {
    const entry = history.current()
    return entry ? entry.uidStatus : "INIT"
  }
)

const getConnLog = createSelector<State, zng.Record[], zng.Record | null>(
  getUidLogs,
  (uids) => {
    return uids.find((log) => log.try("_path")?.toString() === "conn")
  }
)

export default {
  getConnLog,
  getUidStatus,
  getUidLogs,
  build,
  getHistory
}

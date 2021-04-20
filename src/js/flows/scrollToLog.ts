import {isEqual} from "lodash"
import {ZedRecord} from "zealot/zed"
import {Thunk} from "../state/types"
import Viewer from "../state/Viewer"

export default (log: ZedRecord): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = Viewer.getLogs(state)
  const index = logs.findIndex((log2) => isEqual(log2, log))
  const rowHeight = 25 // pixels
  const scrollPos = {x: 0, y: index * rowHeight}
  dispatch(Viewer.setScroll(scrollPos))
}

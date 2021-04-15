import {Thunk} from "../state/types"
import Viewer from "../state/Viewer"
import {isEqual} from "lodash"
import {zng} from "zealot"

export default (log: zng.Record): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = Viewer.getLogs(state)
  const index = logs.findIndex((log2) => isEqual(log2, log))
  const rowHeight = 25 // pixels
  const scrollPos = {x: 0, y: index * rowHeight}
  dispatch(Viewer.setScroll(scrollPos))
}

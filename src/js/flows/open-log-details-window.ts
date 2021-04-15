import produce from "immer"
import ipc from "../electron/ipc"
import invoke from "../electron/ipc/invoke"
import Current from "../state/Current"
import {Thunk} from "../state/types"

export const openLogDetailsWindow = (): Thunk => (dispatch, getState) => {
  const state = produce(getState(), (draft) => {
    for (let tab of draft.tabs.data) {
      delete tab.columns
      delete tab.viewer
    }

    // handlers cannot be serialized to plain js objects
    delete draft.handlers
  })
  const history = Current.getHistory(getState())
  const href = history.createHref(history.location)
  invoke(ipc.windows.open("detail", {size: [700, 600], query: {href}}, state))
}

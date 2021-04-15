import Current from "../state/Current"
import {Thunk} from "../state/types"
import {updateStatus} from "./workspace/update-status"

export const initCurrentTab = (): Thunk => async (dispatch, getState) => {
  const state = getState()
  const ws = Current.getWorkspace(state)
  try {
    await dispatch(updateStatus(ws.id))
  } catch (e) {
    console.error("Workspace connection failed: ", e)
  }
}

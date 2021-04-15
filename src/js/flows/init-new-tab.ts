import {Thunk} from "../state/types"
import Current from "../state/Current"
import Tabs from "../state/Tabs"
import refreshSpaceNames from "./refresh-space-names"
import {workspacePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

export default (): Thunk => (dispatch, getState) => {
  const state = getState()
  const space = Current.getSpace(state)
  const spaceId = Current.getSpaceId(state)
  const spaceIsDeleted = spaceId && !space
  if (spaceIsDeleted) dispatch(resetTab())
}

export function resetTab(): Thunk {
  return (dispatch, getState) => {
    const id = Current.getWorkspaceId(getState())
    dispatch(Tabs.clearActive())
    dispatch(tabHistory.push(workspacePath(id)))
    dispatch(refreshSpaceNames())
  }
}

import tabHistory from "app/router/tab-history"
import {BrimWorkspace} from "../../brim"
import Workspaces from "../../state/Workspaces"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../../state/WorkspaceStatuses/types"
import refreshSpaceNames from "../refresh-space-names"

export const saveWorkspace = (ws: BrimWorkspace, status: WorkspaceStatus) => (
  dispatch,
  _gs
): void => {
  dispatch(Workspaces.add(ws.serialize()))
  dispatch(WorkspaceStatuses.set(ws.id, status))
  dispatch(Workspaces.add(ws.serialize()))
  dispatch(tabHistory.push(`/workspaces/${ws.id}`))
  dispatch(refreshSpaceNames())
}

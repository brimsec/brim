import tabHistory from "app/router/tab-history"
import {workspacesPath} from "app/router/utils/paths"
import {toAccessTokenKey, toRefreshTokenKey} from "../../auth0/utils"
import {popNotice} from "../../components/pop-notice"
import ipc from "../../electron/ipc"
import invoke from "../../electron/ipc/invoke"
import {isDefaultWorkspace} from "../../initializers/init-workspace-params"
import Investigation from "../../state/Investigation"
import Spaces from "../../state/Spaces"
import {Thunk} from "../../state/types"
import Workspaces from "../../state/Workspaces"
import {Workspace} from "../../state/Workspaces/types"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"

const removeWorkspace = (ws: Workspace): Thunk => (dispatch, _getState) => {
  const {name, id, authType} = ws

  if (isDefaultWorkspace(ws))
    throw new Error("Cannot remove the default workspace")

  // remove creds from keychain
  if (authType === "auth0") {
    invoke(ipc.secrets.deleteKey(toAccessTokenKey(id)))
    invoke(ipc.secrets.deleteKey(toRefreshTokenKey(id)))
  }
  dispatch(Investigation.clearWorkspaceInvestigation(id))
  dispatch(Spaces.removeForWorkspace(id))
  dispatch(WorkspaceStatuses.remove(id))
  dispatch(Workspaces.remove(id))

  dispatch(tabHistory.push(workspacesPath()))
  popNotice(`Removed workspace "${name}"`)
}

export default removeWorkspace

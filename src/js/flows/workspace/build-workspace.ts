import isEmpty from "lodash/isEmpty"
import brim, {BrimWorkspace} from "../../brim"
import {Thunk} from "../../state/types"
import {Workspace} from "../../state/Workspaces/types"

export const buildWorkspace = (
  ws: Partial<Workspace>
): Thunk<Promise<BrimWorkspace>> => async (
  dispatch,
  getState,
  {createZealot}
) => {
  if (!ws.host || !ws.port || !ws.id || !ws.name)
    throw new Error("must provide host, port, id, and name to build workspace")
  const zealot = createZealot(brim.workspace(ws as Workspace).getAddress())

  const workspace = {...ws}

  // check version to test that zqd is available, retrieve/update version while doing so
  const {version} = await zealot.version()
  workspace.version = version

  // first time connection, need to determine auth type and set authData accordingly
  if (isEmpty(workspace.authType)) {
    const authMethod = await zealot.authMethod()
    if (authMethod.kind === "auth0") {
      const {client_id: clientId, domain} = authMethod.auth0
      workspace.authType = "auth0"
      workspace.authData = {
        clientId,
        domain
      }
    } else {
      workspace.authType = "none"
    }
  }

  return brim.workspace(workspace as Workspace)
}

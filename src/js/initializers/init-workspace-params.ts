import {Store} from "../state/types"
import Workspaces from "../state/Workspaces"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/get-url-search-params"
import {Workspace} from "../state/Workspaces/types"

const setupDefaultWorkspace = () => (dispatch, _) => {
  const host = "localhost"
  const port = "9867"
  const hostPort = [host, port].join(":")
  const ws: Workspace = {
    host,
    port,
    id: hostPort,
    name: hostPort,
    authType: "none"
  }
  dispatch(Workspaces.add(ws))
}

export const isDefaultWorkspace = (ws: Workspace): boolean => {
  const {host, port, id} = ws
  return id === "localhost:9867" && host === "localhost" && port === "9867"
}

export default function(store: Store) {
  const {id} = getUrlSearchParams()
  global.windowId = id

  const existingWorkspace = Current.getWorkspace(store.getState())

  if (!existingWorkspace) {
    store.dispatch(setupDefaultWorkspace())
  }
}

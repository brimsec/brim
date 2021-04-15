import {getAllStates} from "../../test/helpers/get-test-state"

export default function renameToWorkspace(state: any) {
  // global: clusters -> workspaces
  if (state) {
    const oldState = {...state.globalState.cluster}
    // remove password and username
    Object.values(oldState).forEach((c: any) => {
      delete c.password
      delete c.username
    })
    state.globalState.workspaces = oldState
    delete state.globalState.clusters
  }
  for (const s of getAllStates(state)) {
    delete s.clusters
  }

  // window: current.connectionId -> current.workspaceId
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const tab of s.tabs.data) {
      tab.current.workspaceId = tab.current.connectionId
      delete tab.current.connectionId
    }
  }

  return state
}

import {getAllStates} from "../../test/helpers/get-test-state"

export default function addAuthDefaultsToWorkspaces(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.workspaces) continue
    Object.values(s.workspaces).forEach((ws) => {
      // @ts-ignore
      if (!ws.authType) ws.authType = "none"
    })
  }

  return state
}

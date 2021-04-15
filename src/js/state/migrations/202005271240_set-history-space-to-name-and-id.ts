import {getAllStates} from "../../test/helpers/get-test-state"

export default function setHistorySpaceToNameAndId(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue

    for (const tab of s.tabs.data) {
      if (!tab.history || !tab.history.entries) continue
      for (const e of tab.history.entries) {
        const oldName = e.space
        if (!oldName) continue
        if (!e.spaceId) e.spaceId = oldName
        e.spaceName = oldName

        delete e.space
      }
    }
  }

  return state
}

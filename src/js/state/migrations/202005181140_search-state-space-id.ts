import {getAllStates} from "../../test/helpers/get-test-state"

export default function searchStateSpaceId(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue

    for (const tab of s.tabs.data) {
      const oldName = tab.search.space
      tab.search.spaceName = oldName
      tab.search.spaceId = oldName
      delete tab.search.space
    }
  }

  return state
}

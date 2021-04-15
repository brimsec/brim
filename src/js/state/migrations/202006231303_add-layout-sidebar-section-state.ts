import {getAllStates} from "../../test/helpers/get-test-state"

export default function addLayoutSidebarSectionState(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const tab of s.tabs.data) {
      tab.layout.historyHeight = 1
      tab.layout.spacesHeight = 1
      tab.layout.historyIsOpen = true
      tab.layout.spacesIsOpen = true
    }
  }

  return state
}

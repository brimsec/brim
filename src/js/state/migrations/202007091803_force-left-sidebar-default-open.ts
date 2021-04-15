import {getAllStates} from "../../test/helpers/get-test-state"

export default function forceLeftSidebarDefaultOpen(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const t of s.tabs.data) {
      t.layout.leftSidebarIsOpen = true
      t.layout.leftSidebarWidth = 230
    }
  }

  return state
}

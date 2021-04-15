import {getAllStates} from "../../test/helpers/get-test-state"

export default function sidebarSections(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const tab of s.tabs.data) {
      tab.layout.sidebarSections = [
        {id: "spaces", isOpen: tab.layout.spacesIsOpen},
        {id: "history", isOpen: tab.layout.historyIsOpen}
      ]
      delete tab.layout.spacesIsOpen
      delete tab.layout.spacesHeight
      delete tab.layout.historyIsOpen
      delete tab.layout.historyHeight
    }
  }

  return state
}

import {getAllStates} from "../../test/helpers/get-test-state"

export default function moveSidebarViewToTabLayout(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    const {investigationView, leftSidebarIsOpen, leftSidebarWidth} = s.view

    for (const tab of s.tabs.data) {
      tab.layout.investigationView = investigationView
      tab.layout.leftSidebarIsOpen = leftSidebarIsOpen
      tab.layout.leftSidebarWidth = leftSidebarWidth
    }

    delete s.view.investigationView
    delete s.view.leftSidebarIsOpen
    delete s.view.leftSidebarWidth
  }

  // Migrate state here
  return state
}

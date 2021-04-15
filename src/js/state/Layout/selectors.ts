import activeTabSelect from "../Tab/active-tab-select"
import {TabState} from "../Tab/types"

export default {
  getMainView: activeTabSelect((state: TabState) => state.layout.mainView),

  getSidebarSections: activeTabSelect(
    (state: TabState) => state.layout.sidebarSections
  ),

  getRightSidebarWidth: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarWidth
  ),

  getRightSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarIsOpen
  ),

  getLeftSidebarWidth: activeTabSelect(
    (state: TabState) => state.layout.leftSidebarWidth
  ),

  getLeftSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.leftSidebarIsOpen
  ),

  getInvestigationView: activeTabSelect(
    (state: TabState) => state.layout.investigationView
  ),

  getColumnHeadersView: activeTabSelect(
    (state: TabState) => state.layout.columnHeadersView
  )
}

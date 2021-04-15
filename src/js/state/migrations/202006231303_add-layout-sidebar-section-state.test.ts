import getTestState from "../../test/helpers/get-test-state"
import migrate from "./202006231303_add-layout-sidebar-section-state"

test("migrating 202006231303_addLayoutSidebarSectionState", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  //@ts-ignore
  for (const {state} of Object.values(next.windows)) {
    for (const {layout} of state.tabs.data) {
      expect(layout.historyIsOpen).toEqual(true)
      expect(layout.spacesIsOpen).toEqual(true)
      expect(layout.historyHeight).toEqual(1)
      expect(layout.spacesHeight).toEqual(1)
    }
  }
})

import getTestState from "../../test/helpers/get-test-state"
import migrate from "./202007081719_add-scroll-xy-to-viewer"

test("migrating 202007081719_addScrollXyToViewer", () => {
  const {data} = getTestState("v0.12.0")

  const next = migrate(data)

  const windows = Object.values(next.windows)

  for (const win of windows) {
    //@ts-ignore
    for (const tab of win.state.tabs.data) {
      expect(tab.viewer.scrollX).toBe(0)
      expect(tab.viewer.scrollY).toBe(0)
    }
  }
})

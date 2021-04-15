import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202007091803_forceLeftSidebarDefaultOpen", async () => {
  const next = await migrate({state: "v0.12.0", to: "202007091803"})

  const windows = Object.values(next.windows)

  for (const win of windows) {
    // @ts-ignore
    for (const tab of win.state.tabs.data) {
      expect(tab.layout.leftSidebarIsOpen).toBe(true)
      expect(tab.layout.leftSidebarWidth).toBe(230)
    }
  }
})

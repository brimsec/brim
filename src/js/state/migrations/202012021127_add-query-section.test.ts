import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202012021127_addQuerySection", async () => {
  const next = await migrate({state: "v0.20.0", to: "202012021127"})
  const windows = Object.values(next.windows)
  // @ts-ignore
  for (const {state} of windows) {
    for (const tab of state.tabs.data) {
      expect(tab.layout.sidebarSections.map((s) => s.id)).toEqual([
        "spaces",
        "queries",
        "history"
      ])
    }
  }
})

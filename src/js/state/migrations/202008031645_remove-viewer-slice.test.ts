import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202008031645_removeViewerSlice", async () => {
  const next = await migrate({state: "v0.14.0", to: "202008031645"})

  const windows = Object.values(next.windows)

  for (const win of windows) {
    // @ts-ignore
    for (const tab of win.state.tabs.data) {
      expect(tab.viewer).toBe(undefined)
      expect(tab.chart).toBe(undefined)
    }
  }
})

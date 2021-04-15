import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202007151457_addScrollPosToSearchRecord", async () => {
  const next = await migrate({state: "v0.13.1", to: "202007151457"})

  const windows = Object.values(next.windows)

  for (const win of windows) {
    // @ts-ignore
    for (const tab of win.state.tabs.data) {
      expect(tab.viewer.scrollPos.x).toBe(0)
      expect(tab.viewer.scrollPos.y).toBe(0)
      expect(tab.viewer.scrollX).toBeUndefined()
      expect(tab.viewer.scrollY).toBeUndefined()
    }
  }
})

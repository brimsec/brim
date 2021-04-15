import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202007140829_defaultColumnHeadersToAuto", async () => {
  const next = await migrate({state: "v0.12.0", to: "202007140829"})

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    for (const {layout} of state.tabs.data) {
      expect(layout.columnHeadersView).toEqual("AUTO")
    }
  }
})

import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202009231326_removeLogDetails", async () => {
  const next = await migrate({state: "v0.15.1", to: "202009231326"})

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    state.tabs.data.forEach((t) => {
      expect(t.logDetails).toBe(undefined)
    })
  }
})

import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202011060944_removeClustersStatus", async () => {
  const next = await migrate({state: "v0.17.0", to: "202011060944"})

  const windows = Object.values(next.windows)

  // @ts-ignore
  for (const {state} of windows) {
    Object.values(state.clusters).forEach((c) => {
      expect(c).not.toHaveProperty("status")
    })
  }
})

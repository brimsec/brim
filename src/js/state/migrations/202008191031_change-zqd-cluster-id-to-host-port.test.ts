import {getAllStates, getAllTabs} from "src/js/test/helpers/get-test-state"
import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202008191031_changeZqdClusterIdToHostPort", async () => {
  const next = await migrate({state: "v0.15.1", to: "202008191031"})
  expect.assertions(7)

  const oldId = "zqd"
  const newId = "localhost:9867"
  const newValue = {
    id: newId,
    host: "localhost",
    port: "9867"
  }

  // @ts-ignore
  for (const state of getAllStates(next)) {
    if (!state.clusters) continue
    expect(state.clusters[newId]).toEqual(newValue)
    expect(Object.keys(state.clusters)).not.toContain(oldId)
  }

  for (const tab of getAllTabs(next)) {
    expect(tab.current.connectionId).toBe(newId)
  }
})

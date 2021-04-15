import {migrate} from "src/js/test/helpers/migrate"
import {getAllStates} from "../../test/helpers/get-test-state"

test("migrating 202101210823_renameToWorkspace", async () => {
  expect.assertions(16)
  const next = await migrate({state: "v0.21.1", to: "202101210823"})

  expect(next.globalState.workspaces).toBeDefined()
  Object.values(next.globalState.workspaces).forEach((c: any) => {
    expect(c.password).toBeUndefined()
    expect(c.username).toBeUndefined()
  })
  expect(next.globalState.clusters).toBeUndefined()
  for (const state of getAllStates(next)) {
    expect(state.clusters).toBeUndefined()
    if (!state.tabs) continue
    state.tabs.data.forEach((t) => {
      expect(t.current.connectionId).toBeUndefined()
      expect(t.current.workspaceId).toBeDefined()
    })
  }
})

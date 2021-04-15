import {migrate} from "src/js/test/helpers/migrate"
import {getAllStates} from "../../test/helpers/get-test-state"

test("migrating 202101291548_addAuthDefaultsToWorkspaces", async () => {
  expect.assertions(6)
  const next = await migrate({state: "v0.23.0", to: "202101291548"})

  for (const state of getAllStates(next)) {
    Object.values(state.workspaces).forEach((ws) =>
      // @ts-ignore
      expect(ws.authType).toBeDefined()
    )
  }
})

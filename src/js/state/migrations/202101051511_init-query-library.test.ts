import {migrate} from "src/js/test/helpers/migrate"
import {getAllStates} from "../../test/helpers/get-test-state"

test("migrating 202101051511_initQueryLibrary", async () => {
  const next = await migrate({state: "v0.21.1", to: "202101051511"})

  for (const state of getAllStates(next)) {
    expect(state.queries).toBe(undefined)
  }
})

import Prefs from "../Prefs"
import getTestState, {getAllStates} from "../../test/helpers/get-test-state"
import migrate from "./202005151706_add-zeek-runner-pref"

test("migrating 202005151706_addZeekRunnerPref", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  for (const state of getAllStates(next)) {
    expect(Prefs.getZeekRunner(state)).toEqual("")
  }
})

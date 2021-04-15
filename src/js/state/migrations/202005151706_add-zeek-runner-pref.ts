import {getAllStates} from "../../test/helpers/get-test-state"

export default function addZeekRunnerPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.zeekRunner = ""
  }
  return state
}

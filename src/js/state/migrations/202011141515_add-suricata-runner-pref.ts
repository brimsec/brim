import {getAllStates} from "../../test/helpers/get-test-state"

export default function addSuricataRunnerPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.suricataRunner = ""
  }
  return state
}

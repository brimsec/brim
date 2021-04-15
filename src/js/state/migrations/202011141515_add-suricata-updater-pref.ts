import {getAllStates} from "../../test/helpers/get-test-state"

export default function addSuricataUpdaterPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.suricataUpdater = ""
  }
  return state
}

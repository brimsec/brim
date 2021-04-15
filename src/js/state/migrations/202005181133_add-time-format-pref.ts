import {getAllStates} from "../../test/helpers/get-test-state"

export default function addTimeFormatPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.timeFormat = ""
  }
  return state
}

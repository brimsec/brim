import {getAllStates} from "../../test/helpers/get-test-state"

export default function removeLogDetails(state: any) {
  // Default search records to "events"
  for (const s of getAllStates(state)) {
    if (s.tabs) {
      for (const t of s.tabs.data) {
        delete t.logDetails
      }
    }
  }
  return state
}

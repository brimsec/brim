import {getAllStates} from "../../test/helpers/getTestState"

export default function dropSpaces(state: any) {
  // Default search records to "events"
  for (const s of getAllStates(state)) {
    if (s.tabs) {
      for (const t of s.tabs.data) {
        delete t.spaces
      }
    }
  }
  return state
}

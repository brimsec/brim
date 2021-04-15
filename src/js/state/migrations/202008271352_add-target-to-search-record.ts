import {getAllStates} from "../../test/helpers/get-test-state"

export default function addTargetToSearchRecord(state: any) {
  // Default search records to "events"
  for (const s of getAllStates(state)) {
    s.investigation.forEach((f) => {
      f.search.target = "events"
    })

    if (s.tabs) {
      for (const t of s.tabs.data) {
        t.history.entries.forEach((e) => {
          e.target = "events"
        })
      }
    }
  }

  return state
}

import {getAllStates} from "../../test/helpers/get-test-state"

export default function addScrollXyToViewer(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const t of s.tabs.data) {
      t.viewer.scrollX = 0
      t.viewer.scrollY = 0
    }
  }

  return state
}

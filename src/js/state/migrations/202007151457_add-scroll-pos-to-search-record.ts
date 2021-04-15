import {getAllStates} from "../../test/helpers/get-test-state"

export default function addScrollPosToSearchRecord(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const t of s.tabs.data) {
      t.viewer.scrollPos = {x: 0, y: 0}
      delete t.viewer.scrollX
      delete t.viewer.scrollY
    }
  }
  return state
}

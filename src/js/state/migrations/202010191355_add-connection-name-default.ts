import {getAllStates} from "../../test/helpers/get-test-state"

export default function addConnectionNameDefault(state: any) {
  // backfill connection names with id
  for (const s of getAllStates(state)) {
    if (!s.clusters) continue
    Object.values(s.clusters).forEach((c: any) => {
      c.name = c.id
    })
  }

  return state
}

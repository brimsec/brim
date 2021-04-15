import {getAllStates} from "../../test/helpers/get-test-state"

export default function refactorInvestigations(state: any) {
  for (const s of getAllStates(state)) {
    const newState = {}
    s.investigation.forEach((f) => {
      if (!f) return
      if (!newState[f.search.spaceId]) newState[f.search.spaceId] = []

      newState[f.search.spaceId].push(f)
    })

    s.investigation = {
      "localhost:9867": newState
    }
  }

  return state
}

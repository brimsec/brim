import {getAllStates} from "../../test/helpers/get-test-state"

export default function setInvestigationSpaceToNameAndId(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.investigation) continue

    for (const {search} of s.investigation) {
      const oldName = search.space
      if (oldName) {
        search.spaceName = oldName
        search.spaceId = oldName
      }

      delete search.space
    }
  }

  return state
}

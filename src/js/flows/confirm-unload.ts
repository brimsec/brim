import {isEmpty} from "lodash"

import {Thunk} from "../state/types"
import Current from "../state/Current"
import Handlers from "../state/Handlers"
import Spaces from "../state/Spaces"
import showIngestWarning from "./show-ingest-warning"

export default (): Thunk<Promise<void>> => (dispatch, getState) => {
  const spaceIds = Handlers.getIngestSpaceIds(getState())

  if (isEmpty(spaceIds)) {
    return Promise.resolve()
  } else {
    const workspaceId = Current.getWorkspaceId(getState())
    if (!workspaceId) return
    const names = spaceIds.map((id) => {
      const space = Spaces.get(workspaceId, id)(getState())
      if (space) return space.name
      else return id
    })
    return showIngestWarning(names)
  }
}

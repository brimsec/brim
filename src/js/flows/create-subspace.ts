import {Thunk} from "../state/types"
import {createSpaceName} from "../brim/space-name"
import {getUniqName} from "../lib/uniq-name"
import {getZealot} from "./get-zealot"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import refreshSpaceNames from "./refresh-space-names"

class CreateSubspaceError extends Error {}

export default (): Thunk<Promise<void>> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const spaceId = Current.getSpaceId(getState())
  const workspaceId = Current.getWorkspaceId(getState())
  const names = Spaces.getSpaces(workspaceId)(getState()).map((s) => s.name)
  const records = Viewer.getSelectedRecords(getState())
  if (!records.length)
    return Promise.reject(new CreateSubspaceError("No selected logs"))

  try {
    const logs = records.map((r) => r.get("_log").toString())
    const keys = records.map((r) => r.get("key").toString())
    const name = getUniqName(createSpaceName(keys[0]), names)
    return zealot.subspaces
      .create({name, spaceId, logs})
      .then((space) =>
        dispatch(refreshSpaceNames()).then(() => dispatch(Tabs.new(space.id)))
      )
  } catch (e) {
    return Promise.reject(new CreateSubspaceError(e.message))
  }
}

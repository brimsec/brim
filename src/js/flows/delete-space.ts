import {Thunk} from "../state/types"
import {getZealot} from "./get-zealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Spaces from "../state/Spaces"
import SystemTest from "../state/SystemTest"

const deleteSpace = (id: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const zealot = dispatch(getZealot())
  const workspaceId = Current.getWorkspaceId(getState())
  return zealot.spaces.delete(id).then(() => {
    dispatch(Investigation.clearSpaceInvestigation(workspaceId, id))
    dispatch(Spaces.remove(workspaceId, id))
    dispatch(SystemTest.hook("space-deleted"))
  })
}

export default deleteSpace

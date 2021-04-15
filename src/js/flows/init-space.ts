import brim from "../brim"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import {Thunk} from "../state/types"
import {getZealot} from "./get-zealot"

export const initSpace = (spaceId: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const workspaceId = Current.getWorkspaceId(getState())
  if (!workspaceId) return
  const zealot = dispatch(getZealot())
  return zealot.spaces
    .get(spaceId)
    .then(brim.interop.spacePayloadToSpace)
    .then((data) => {
      dispatch(Spaces.setDetail(workspaceId, data))
    })
    .catch((error) => {
      console.error(error)
    })
}

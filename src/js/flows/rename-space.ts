import {Thunk} from "../state/types"
import Spaces from "../state/Spaces"
import {getZealot} from "./get-zealot"

export default (
  workspaceId: string,
  spaceId: string,
  name: string
): Thunk<Promise<void>> => (dispatch) => {
  const zealot = dispatch(getZealot())

  return zealot.spaces.update(spaceId, {name}).then(() => {
    dispatch(Spaces.rename(workspaceId, spaceId, name))
  })
}

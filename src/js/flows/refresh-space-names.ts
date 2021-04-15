import {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import {getZealot} from "./get-zealot"

export default function refreshSpaceNames(): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    return zealot.spaces.list().then((spaces) => {
      spaces = spaces || []
      const id = Current.getWorkspaceId(getState())
      if (id) dispatch(Spaces.setSpaces(id, spaces))
    })
  }
}

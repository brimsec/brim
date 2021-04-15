import {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import {getZealot} from "./get-zealot"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    const id = Current.getSpaceId(getState())

    return zealot.spaces.get(id).then((data: any) => {
      const id = Current.getWorkspaceId(getState())
      if (!id) return
      dispatch(Spaces.setDetail(id, data))
    })
  }
}

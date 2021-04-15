import {Thunk} from "../state/types"
import Current from "../state/Current"
import refreshSpaceNames from "./refresh-space-names"
import {getZealot} from "./get-zealot"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

type Props = {
  name: string
  kind: "archivestore" | "filestore"
  data_path: string
}

export const createSpace = ({
  name,
  kind,
  data_path
}: Props): Thunk<Promise<void>> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const workspaceId = Current.getWorkspaceId(getState())
  return zealot.spaces
    .create({
      name,
      storage: {kind},
      data_path: data_path.length ? data_path : undefined
    })
    .then((space) => {
      dispatch(refreshSpaceNames()).then(() =>
        dispatch(tabHistory.push(lakePath(space.id, workspaceId)))
      )
    })
}

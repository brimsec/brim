import {Thunk} from "../state/types"
import refreshSpaceNames from "./refresh-space-names"
import deleteSpace from "./delete-space"
import Notice from "../state/Notice"

const deleteSpaces = (ids: string[]): Thunk<Promise<void[] | void>> => (
  dispatch
) => {
  return Promise.all(ids.map((id) => dispatch(deleteSpace(id))))
    .catch((e) => {
      dispatch(Notice.set(new Error(`Error deleting spaces: ${e.message}`)))
    })
    .finally(() => dispatch(refreshSpaceNames()))
}

export default deleteSpaces

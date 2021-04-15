import ipc from "../electron/ipc"
import invoke from "../electron/ipc/invoke"
import Search from "../state/Search"
import {Thunk} from "../state/types"

export const openNewSearchTab = (): Thunk => (dispatch, getState) => {
  const href = Search.createHref(getState())
  invoke(ipc.windows.newSearchTab({href}))
}

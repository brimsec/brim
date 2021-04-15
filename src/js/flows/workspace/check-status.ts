import {Thunk} from "../../state/types"
import Current from "../../state/Current"
import Notice from "../../state/Notice"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"

export const checkStatus = (): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const {host, port, id} = Current.getWorkspace(getState())
  const hostPort = [host, port].join(":")

  // create default zealot client
  const zealot = createZealot(hostPort)

  return zealot.status().then(() => {
    dispatch(WorkspaceStatuses.set(id, "connected"))
    dispatch(Notice.dismiss())
  })
}

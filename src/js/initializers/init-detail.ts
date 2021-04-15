import {viewLogDetail} from "../flows/view-log-detail"
import Current from "../state/Current"
import LogDetails from "../state/LogDetails"
import Search from "../state/Search/actions"
import brim from "../brim"
import initialize from "./initialize"

export default async () => {
  const store = await initialize()
  // Set the span to everything
  const space = Current.mustGetSpace(store.getState())
  space && store.dispatch(Search.setSpan(brim.space(space).everythingSpan()))

  // View the latest log and clear log detail history
  const log = LogDetails.build(store.getState())
  store.dispatch(LogDetails.clear())
  log && store.dispatch(viewLogDetail(log))

  return store
}

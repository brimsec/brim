import {combineReducers} from "redux"

import Workspaces from "./Workspaces"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Investigation from "./Investigation"
import Modal from "./Modal"
import Notice from "./Notice"
import Packets from "./Packets"
import Prefs from "./Prefs"
import Spaces from "./Spaces"
import Tabs from "./Tabs"
import View from "./View"
import Queries from "./Queries"
import SystemTest from "./SystemTest"
import Feature from "./Feature"
import WorkspaceStatuses from "./WorkspaceStatuses"
import TabHistories from "./TabHistories"
import Url from "./Url"

export default combineReducers<any, any>({
  errors: Errors.reducer,
  workspaces: Workspaces.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  handlers: Handlers.reducer,
  tabs: Tabs.reducer,
  investigation: Investigation.reducer,
  view: View.reducer,
  spaces: Spaces.reducer,
  packets: Packets.reducer,
  prefs: Prefs.reducer,
  systemTest: SystemTest.reducer,
  feature: Feature.reducer,
  workspaceStatuses: WorkspaceStatuses.reducer,
  queries: Queries.reducer,
  tabHistories: TabHistories.reducer,
  url: Url.reducer
})

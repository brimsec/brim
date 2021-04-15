import Histories from "app/core/models/histories"
import path from "path"
import getUrlSearchParams from "../lib/get-url-search-params"
import Feature from "../state/Feature"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "app/router/tab-history"

export default function initGlobals(store: Store) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
  global.windowName = getWindowName()
  global.feature = (name, status) => store.dispatch(Feature.set(name, status))
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.windowHistory.replace(getUrlSearchParams().href)
  global.navTo = (path) => store.dispatch(tabHistory.push(path))
}

function getWindowName() {
  const name = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"
  if (["search", "about", "detail"].includes(name)) return name
  throw new Error(`Unregistered window: ${name}`)
}

import Histories from "app/core/models/histories"
import path from "path"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import Feature from "../state/Feature"
import TabHistories from "../state/TabHistories"
import {Store} from "../state/types"
import {createMemoryHistory} from "history"
import tabHistory from "app/router/tab-history"
import BrimApi from "./brimApi"

export default function initGlobals(store: Store, api?: BrimApi) {
  global.getState = store.getState
  global.windowId = getUrlSearchParams().id
  global.windowName = getWindowName()
  global.feature = (name, status) => store.dispatch(Feature.set(name, status))
  global.tabHistories = new Histories(TabHistories.selectAll(store.getState()))
  global.windowHistory = createMemoryHistory()
  global.windowHistory.replace(getUrlSearchParams().href)
  global.navTo = (path) => store.dispatch(tabHistory.push(path))

  // TODO: create mockApi for tests
  if (api) {
    global.executeCommand = (command: string, ...args: any[]) =>
      api.commands.execute(command, args)
  }
}

function getWindowName() {
  const name = path.basename(window.location.pathname, ".html") as
    | "search"
    | "about"
    | "detail"
  if (["search", "about", "detail"].includes(name)) return name
  throw new Error(`Unregistered window: ${name}`)
}

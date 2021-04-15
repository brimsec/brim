import initDOM from "./init-dom"
import initGlobals from "./init-globals"
import initIpcListeners from "./init-ipc-listeners"
import initMenuActionListeners from "./init-menu-action-listeners"
import initStore from "./init-store"
import initWorkspaceParams from "./init-workspace-params"

export default async function initialize() {
  const store = await initStore()
  initDOM()
  initGlobals(store)
  initIpcListeners(store)
  initMenuActionListeners(store)
  initWorkspaceParams(store)
  return store
}

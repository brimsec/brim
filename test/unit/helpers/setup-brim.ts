import {Brim} from "src/js/electron/brim"
import initializeMainIpc from "src/js/electron/initialize-main-ipc"
import initialize from "src/js/initializers/initialize"
import Current from "src/js/state/Current"

export async function setupBrim() {
  const brim = new Brim()
  initializeMainIpc(brim)
  const {store} = await initialize()
  const select = (fn) => fn(store.getState())
  const dispatch = store.dispatch

  return {
    brim,
    store,
    select,
    dispatch,
    navTo(route) {
      select(Current.getHistory).push(route)
    }
  }
}

export function onPage(name) {
  // Some parts of the app check the html file they are running on and
  // adjust their behavior.
  window.history.replaceState(null, `Testing Page: ${name}`, `${name}.html`)
}

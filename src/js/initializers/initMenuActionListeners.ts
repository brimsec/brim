import {Store} from "../state/types"
import menu from "../electron/menu"

export default function(store: Store) {
  for (let name in menu.actions.search) {
    menu.actions.search[name].listen(store.dispatch)
  }
  console.log("listening in the renderer")
  for (let name in menu.actions.detail) {
    menu.actions.detail[name].listen(store.dispatch)
  }
}

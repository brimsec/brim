import tabHistory from "app/router/tab-history"
import {NewTabSearchParams} from "../electron/ipc/windows/messages"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"

export default function(store: Store, params: NewTabSearchParams) {
  const {href, isNewWin} = params
  if (!isNewWin) {
    store.dispatch(Tabs.new(href))
  } else {
    store.dispatch(tabHistory.replace(href))
  }
}

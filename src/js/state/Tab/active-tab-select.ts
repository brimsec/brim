import {createSelector} from "reselect"

import {State} from "../types"
import {TabState} from "./types"
import Tabs from "../Tabs"

export default function activeTabSelect<T>(
  fn: (arg0: TabState, arg1: State) => T
): (arg0: State) => T {
  return createSelector<State, TabState, State, T>(
    Tabs.getActiveTab,
    (state) => state,
    fn
  )
}

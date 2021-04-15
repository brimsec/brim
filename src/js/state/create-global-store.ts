import {configureStore} from "@reduxjs/toolkit"
import globalReducer, {GlobalState} from "./global-reducer"

export default function(initState: GlobalState | undefined) {
  return configureStore({reducer: globalReducer, preloadedState: initState})
}

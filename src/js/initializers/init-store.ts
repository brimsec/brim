import {createZealot} from "zealot"
import {globalDispatchMiddleware} from "../state/global-context"
import getUrlSearchParams from "../lib/get-url-search-params"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import rootReducer from "../state/root-reducer"
import {configureStore} from "@reduxjs/toolkit"

function getInitialState(windowId) {
  return Promise.all([
    invoke(ipc.windows.initialState(windowId)),
    invoke(ipc.globalStore.init()).then(({initialState}) => initialState)
  ]).then(([winState, globalState]) => ({...winState, ...globalState}))
}

export default async () => {
  const windowId = getUrlSearchParams().id
  const initialState = await getInitialState(windowId)
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaults) => [
      ...getDefaults({
        thunk: {
          extraArgument: {createZealot}
        },
        serializableCheck: false,
        immutableCheck: false
      }),
      globalDispatchMiddleware
    ]
  })
}

import {configureStore} from "@reduxjs/toolkit"
import {createZealotMock, Zealot} from "zealot"
import BrimApi from "src/js/api"
import initGlobals from "src/js/initializers/initGlobals"
import rootReducer from "src/js/state/rootReducer"
import {Action, State, Store} from "src/js/state/types"

export type TestStore = {
  dispatchAll: Function
  getActions: Function
  getActionTypes: Function
  clearActions: Function
} & Store

export default (
  zealot?: Zealot,
  api?: BrimApi,
  initialState?: Partial<State>
): TestStore => {
  const client = zealot || createZealotMock().zealot
  const createZealot = () => client
  const store = configureStore({
    preloadedState: initialState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {createZealot, api}
        },
        serializableCheck: false,
        immutableCheck: false
      }),
    enhancers: (defaultEnhancers) => [
      applyDispatchAll(),
      ...defaultEnhancers,
      applyActionHistory()
    ]
  }) as any
  initGlobals(store)
  return store
}

function applyDispatchAll() {
  return (createStore) => (...args) => {
    const store = createStore(...args)

    const dispatchAll = (actions: Action[]): State => {
      actions.forEach(store.dispatch)
      return store.getState()
    }

    return {
      ...store,
      dispatchAll
    }
  }
}

function applyActionHistory() {
  let actions = []
  return (createStore) => (...args) => {
    const store = createStore(...args)

    const dispatch = (...args) => {
      actions.push(args[0])
      return store.dispatch(...args)
    }

    const getActions = () => {
      return actions
    }

    const clearActions = () => {
      actions = []
    }

    return {
      ...store,
      dispatch,
      getActions,
      clearActions
    }
  }
}

import {render as rtlRender} from "@testing-library/react"
import AppRouter from "app/router/app-router"
import WindowRouter from "app/router/window-router"
import React from "react"
import {Provider} from "react-redux"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {getHistory} from "src/js/state/Current/selectors"
import theme from "src/js/style-theme"
import {ThemeProvider} from "styled-components"
import initTestStore from "./initTestStore"

export function render(
  ui,
  {
    initialState = undefined,
    store = initTestStore(undefined, undefined, initialState),
    route = undefined,
    ...renderOptions
  } = {}
) {
  function Wrapper({children}) {
    const Router = getRouter()
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>{children}</Router>
          <HTMLContextMenu />
        </ThemeProvider>
      </Provider>
    )
  }

  if (route) {
    getHistory(store.getState()).push(route)
  }

  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
}

function getRouter() {
  if (global.windowName === "detail") return WindowRouter
  if (global.windowName === "search") return AppRouter
  return NoRouter
}

function NoRouter({children}) {
  return children
}

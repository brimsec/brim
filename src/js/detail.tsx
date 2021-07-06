import WindowRouter from "app/router/window-router"
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import "regenerator-runtime/runtime"
import {ThemeProvider} from "styled-components"
import AppErrorBoundary from "./components/AppErrorBoundary"
import BrimTooltip from "./components/BrimTooltip"
import LogDetailsWindow from "./components/LogDetailsWindow"
import {Modals} from "./components/Modals"
import StartupError from "./components/StartupError"
import initDetail from "./initializers/initDetail"
import lib from "./lib"
import theme from "./style-theme"

initDetail()
  .then(({store, pluginManager}) => {
    window.onbeforeunload = () => {
      pluginManager.deactivate()
    }
    ReactDOM.render(
      <WindowRouter>
        <AppErrorBoundary>
          <div id="modal-dialog-root" />
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <LogDetailsWindow />
              <Modals />
              <BrimTooltip />
            </ThemeProvider>
          </Provider>
        </AppErrorBoundary>
      </WindowRouter>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })

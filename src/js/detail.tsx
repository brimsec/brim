import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {Router} from "react-router"
import "regenerator-runtime/runtime"
import {ThemeProvider} from "styled-components"
import AppErrorBoundary from "./components/app-error-boundary"
import BrimTooltip from "./components/brim-tooltip"
import LogDetailsWindow from "./components/LogDetailsWindow"
import {Modals} from "./components/Modals"
import StartupError from "./components/startup-error"
import initDetail from "./initializers/init-detail"
import lib from "./lib"
import theme from "./style-theme"

initDetail()
  .then((store) => {
    ReactDOM.render(
      <Router history={global.windowHistory}>
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
      </Router>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })

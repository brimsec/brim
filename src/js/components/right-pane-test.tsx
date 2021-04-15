import tabHistory from "app/router/tab-history"
import {workspacesPath} from "app/router/utils/paths"
import React from "react"
import {zng} from "zealot"
import Layout from "../state/Layout"
import LogDetails from "../state/LogDetails"
import loginTo from "../test/helpers/login-to"
import provide from "../test/helpers/provide"
import {XRightPane} from "./right-pane"

test("no errors if space does not exist", async () => {
  const {store} = await loginTo("workspace1", "space1")

  store.dispatch(Layout.showRightSidebar())
  store.dispatch(tabHistory.push(workspacesPath()))
  store.dispatch(LogDetails.push(new zng.Record([], [])))
  const el = provide(store, <XRightPane />)
  expect(el.html()).toBe("")
})

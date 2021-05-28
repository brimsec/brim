import tabHistory from "app/router/tab-history"
import {workspacesPath} from "app/router/utils/paths"
import React from "react"
import {createRecord} from "test/shared/factories/zed-factory"
import Layout from "../state/Layout"
import LogDetails from "../state/LogDetails"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"
import {XRightPane} from "./RightPane"

test("no errors if pool does not exist", async () => {
  const {store} = await loginTo("workspace1", "pool1")

  store.dispatch(Layout.showRightSidebar())
  store.dispatch(tabHistory.push(workspacesPath()))
  store.dispatch(LogDetails.push(createRecord({})))
  const el = provide(store, <XRightPane />)
  expect(el.html()).toBe("")
})

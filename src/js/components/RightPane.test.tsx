import tabHistory from "app/router/tab-history"
import {workspacesPath} from "app/router/utils/paths"
import React from "react"
import {ZedRecord} from "zealot/zed"
import Layout from "../state/Layout"
import LogDetails from "../state/LogDetails"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"
import {XRightPane} from "./RightPane"

test("no errors if space does not exist", async () => {
  const {store} = await loginTo("workspace1", "space1")

  store.dispatch(Layout.showRightSidebar())
  store.dispatch(tabHistory.push(workspacesPath()))
  store.dispatch(LogDetails.push(new ZedRecord({fields: []})))
  const el = provide(store, <XRightPane />)
  expect(el.html()).toBe("")
})

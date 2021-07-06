import {lakePath} from "app/router/utils/paths"
import React from "react"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import Pools from "src/js/state/Pools"
import Workspaces from "src/js/state/Workspaces"
import {createRecord} from "test/shared/factories/zed-factory"
import fixtures from "test/unit/fixtures"
import {
  screen,
  onPage,
  render,
  setupBrim,
  fireEvent,
  flushPromises
} from "test/unit/helpers"
import LogDetailsWindow from "./index"

onPage("detail")

const workspace = fixtures("workspace1")
const pool = fixtures("pool1")
const record = createRecord({ts: new Date(0), name: "Alice", age: 99})
let renderOpts

beforeEach(async () => {
  const {store, dispatch, navTo, brim} = await setupBrim()
  dispatch(Workspaces.add(workspace))
  dispatch(Pools.setDetail(workspace.id, pool))
  dispatch(viewLogDetail(record))
  navTo(lakePath(pool.id, workspace.id))
  renderOpts = {store}
})

test("hello", async () => {
  render(<LogDetailsWindow />, renderOpts)

  fireEvent.contextMenu(screen.getByText("Alice"))
  fireEvent.click(screen.getByText(/new search with this value/i))
  await flushPromises()

  expect()
})

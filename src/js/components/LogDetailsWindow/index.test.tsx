import {lakePath} from "app/router/utils/paths"
import React from "react"
import BrimApi from "src/js/api"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import initIpcListeners from "src/js/initializers/initIpcListeners"
import initMenuActionListeners from "src/js/initializers/initMenuActionListeners"
import Tabs from "src/js/state/Tabs"
import {createRecord} from "test/shared/factories/zed-factory"
import fixtures from "test/unit/fixtures"
import {fireEvent, render, screen} from "test/unit/helpers"
import initTestStore from "test/unit/helpers/initTestStore"
import {testBrim} from "test/unit/setup/after-env/setup-ipc"
import LogDetailsWindow from "./index"

window.history.replaceState(null, "Detail", "/detail.html")

const workspace = fixtures("workspace1")
const pool = fixtures("pool1")
const initialState = {
  workspaces: {
    [workspace.id]: workspace
  },
  pools: {
    [workspace.id]: {
      [pool.id]: pool
    }
  }
}

const store = initTestStore(null, new BrimApi(), initialState)
initMenuActionListeners(store)
initIpcListeners(store, null)
// Maybe move this to a function to test things on a page

store.dispatch(
  viewLogDetail(createRecord({ts: new Date(0), name: "Alice", age: 99}))
)

function flushPromises() {
  return new Promise(setTimeout)
}

// Before each test, all the ipc listeners need to be setup/torn down
// Before each test the brim instance needs to be setup
//

// Necessary to render certain components
// 0. The page the component should render on
// 0. a workspace and pool
// 1. store
// 2. router
// 3. theme
// 3. main-process ipc listeners
// 4. main-process brim instance
// 5. render-process ipc listeners
//

test("right clicking opens a new window", async () => {
  const before = testBrim.windows.count()
  render(<LogDetailsWindow />, {
    store,
    route: lakePath(pool.id, workspace.id)
  })
  fireEvent.contextMenu(screen.getByText("Alice"))
  fireEvent.click(screen.getByText(/new search with this value/i))

  await flushPromises()

  fireEvent.contextMenu(screen.getByText("99"))
  fireEvent.click(screen.getByText(/filter = value/i))

  await flushPromises()

  expect(Tabs.getCount(store.getState())).toBe(2)

  expect(testBrim.windows.count()).toBe(before + 1)
  expect(testBrim.windows.getWindows()[0].query.href).toContain("Alice")
})

test("second right clicking opens a new window", async () => {
  const before = testBrim.windows.count()
  render(<LogDetailsWindow />, {
    store,
    route: lakePath(pool.id, workspace.id)
  })
  fireEvent.contextMenu(screen.getByText("Alice"))
  fireEvent.click(screen.getByText(/new search with this value/i))

  await flushPromises()

  fireEvent.contextMenu(screen.getByText("99"))
  fireEvent.click(screen.getByText(/filter = value/i))

  await flushPromises()

  expect(Tabs.getCount(store.getState())).toBe(2)

  expect(testBrim.windows.count()).toBe(before + 1)
  expect(testBrim.windows.getWindows()[0].query.href).toContain("Alice")
})

onPage("detail")

test("render complicated thing", () => {
  const {store, brim, api} = setupBrim()
  render(<MyComponent />, {store})
})

test("hi")

import tabHistory from "app/router/tab-history"
import {lakePath, workspacePath} from "app/router/utils/paths"
import fixtures from "../../test/fixtures"
import initTestStore from "../../test/init-test-store"
import Spaces from "../Spaces"
import Workspaces from "../Workspaces"
import {Workspace} from "../Workspaces/types"
import Current from "./"

let store

beforeEach(() => {
  store = initTestStore()
})

test("setting the space id", () => {
  store.dispatch(tabHistory.push(lakePath("1", "1")))

  expect(Current.getSpaceId(store.getState())).toBe("1")
})

test("setting the workspace id", () => {
  store.dispatch(tabHistory.push(workspacePath("a")))

  expect(Current.getWorkspaceId(store.getState())).toBe("a")
})

test("getting the actual workspace", () => {
  const ws: Workspace = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([Workspaces.add(ws)])
  store.dispatch(tabHistory.push(workspacePath(ws.id)))

  expect(Current.mustGetWorkspace(state).serialize()).toEqual(ws)
})

test("getting the actual space", () => {
  const space = fixtures("space1")
  const ws: Workspace = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([
    Workspaces.add(ws),
    Spaces.setDetail("myws", space)
  ])
  store.dispatch(tabHistory.push(lakePath(space.id, ws.id)))

  expect(Current.mustGetSpace(state)).toEqual(expect.objectContaining(space))
})

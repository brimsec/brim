import Workspaces from "./"
import initTestStore from "../../test/init-test-store"
import {Workspace} from "./types"

let store
beforeEach(() => {
  store = initTestStore()
})

const workspace: Workspace = {
  id: "123",
  name: "123",
  host: "boom.com",
  port: "9867",
  authType: "none"
}

test("addWorkspace", () => {
  const state = store.dispatchAll([Workspaces.add(workspace)])

  expect(Workspaces.id("123")(state)).toEqual(workspace)
})

test("addWorkspace when it already exists", () => {
  const state = store.dispatchAll([
    Workspaces.add(workspace),
    Workspaces.add(workspace)
  ])

  expect(Workspaces.all(state)).toEqual([workspace])
})

test("removeCluster", () => {
  const state = store.dispatchAll([
    Workspaces.add(workspace),
    Workspaces.remove("123")
  ])

  expect(Workspaces.all(state)).toEqual([])
})

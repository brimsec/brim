import initTestStore from "../../test/init-test-store"
import WorkspaceStatuses from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("set/remove workspace status", () => {
  expect(WorkspaceStatuses.get("123")(store.getState())).toBeUndefined()

  let state = store.dispatchAll([WorkspaceStatuses.set("123", "connected")])

  expect(WorkspaceStatuses.get("123")(state)).toBe("connected")

  state = store.dispatchAll([WorkspaceStatuses.remove("123")])
  expect(WorkspaceStatuses.get("123")(state)).toBeUndefined()
})

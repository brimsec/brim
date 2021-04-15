import Current from "../Current"
import Search from "../Search"
import Tabs from "./"
import initTestStore from "../../test/init-test-store"

let store
beforeEach(() => {
  store = initTestStore()
})

test("initial state has one tab", () => {
  expect(Tabs.getCount(store.getState())).toBe(1)
})

test("add tab with no data", () => {
  const state = store.dispatchAll([Tabs.add("1", "/")])
  expect(Tabs.getCount(state)).toBe(2)
})

test("add tab with data and activate", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/workspaces/a"),
    Tabs.activate("1")
  ])
  expect(Current.getWorkspaceId(state)).toEqual("a")
})

test("cannot activate tab that does not exist in data", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.activate("1"),
    Tabs.activate("does-not-exist")
  ])
  const tab = Tabs.getActiveTab(state)
  expect(tab.id).toBe("1")
})

test("remove tab", () => {
  const state = store.dispatchAll([Tabs.add("1", "/"), Tabs.remove("1")])
  expect(Tabs.getCount(state)).toBe(1)
})

test("forwards actions to the active tab", () => {
  const state = store.dispatchAll([Search.setSpanArgs(["now-1m", "now"])])
  const tab = Tabs.getActiveTab(state)
  expect(tab.search.spanArgs).toEqual(["now-1m", "now"])
})

test("remove last, active tab", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.add("2", "/"),
    Tabs.activate("2"),
    Tabs.remove("2")
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove middle, active tab", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.add("2", "/"),
    Tabs.add("3", "/"),
    Tabs.add("4", "/"),
    Tabs.activate("2"),
    Tabs.remove("2")
  ])
  expect(Tabs.getActive(state)).toBe("3")
})

test("remove first, active tab", () => {
  const first = Tabs.getData(store.getState())[0].id
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.add("2", "/"),
    Tabs.add("3", "/"),
    Tabs.add("3", "/"),
    Tabs.remove(first)
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove non-active tab before active tab", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.add("2", "/"),
    Tabs.activate("2"),
    Tabs.remove("1")
  ])
  expect(Tabs.getActive(state)).toBe("2")
})

test("remove non-active tab after active tab", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.add("2", "/"),
    Tabs.activate("1"),
    Tabs.remove("2")
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove tab does nothing if only one tab left", () => {
  const first = Tabs.getData(store.getState())[0].id
  const state = store.dispatchAll([Tabs.remove(first)])

  expect(Tabs.getCount(state)).toBe(1)
})

test("moving a tab to destination index", () => {
  const state = store.dispatchAll([
    Tabs.add("1", "/"),
    Tabs.add("2", "/"),
    Tabs.add("3", "/"),
    Tabs.add("4", "/"),
    Tabs.move("3", 0)
  ])
  const ids = Tabs.getData(state).map((t) => t.id)

  expect(ids.length).toEqual(5)
  expect(ids[0]).toEqual("3")
})

test("reorder tabs", () => {
  const first = Tabs.getData(store.getState())[0].id

  const state = store.dispatchAll([
    Tabs.add("a", "/"),
    Tabs.add("b", "/"),
    Tabs.add("c", "/"),
    Tabs.order([3, 1, 2, 0])
  ])

  expect(Tabs.getData(state).map((t) => t.id)).toEqual(["c", "a", "b", first])
})

test("reorder tabs does not throw error if invalid", () => {
  const first = Tabs.getData(store.getState())[0].id

  const state = store.dispatchAll([
    Tabs.add("a", "/"),
    Tabs.add("b", "/"),
    Tabs.add("c", "/"),
    Tabs.order([0, 0, 0, 0])
  ])

  expect(Tabs.getData(state).map((t) => t.id)).toEqual([first])
})

test("reset tab", () => {
  const state = store.dispatchAll([Tabs.clearActive()])

  const tab = Tabs.getActiveTab(state)
  expect(tab.id).toEqual(Tabs.getActive(state))
  expect(Current.getSpaceId(state)).toEqual(null)
})

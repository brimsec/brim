import tabHistory from "app/router/tab-history"
import initTestStore from "src/js/test/init-test-store"
import Current from "../Current"
import Tabs from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

const currentPathnames = () =>
  Current.getHistory(store.getState(), "search").entries.map((e) => e.pathname)

test("adding a tab creates a history entry", () => {
  expect(global.tabHistories.count()).toBe(0)
  store.dispatch(Tabs.add("2", "/"))
  expect(global.tabHistories.count()).toBe(1)
})

test("activate sets the global.tabHistory", () => {
  expect(global.tabHistories.count()).toBe(0)
  store.dispatch(tabHistory.push("/url-for-tab-1"))
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-1"])

  store.dispatch(Tabs.add("2", "/"))
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-1"])

  store.dispatch(Tabs.activate("2"))
  store.dispatch(tabHistory.push("/url-for-tab-2"))
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-2"])
  expect(global.tabHistories.count()).toBe(2)
})

test("removing a tab removes the history too", () => {
  store.dispatch(tabHistory.push("/url-for-tab-1"))
  store.dispatch(Tabs.add("2", "/"))
  store.dispatch(Tabs.activate("2"))
  store.dispatch(Tabs.remove("2"))

  expect(global.tabHistories.count()).toBe(1)
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-1"])
})

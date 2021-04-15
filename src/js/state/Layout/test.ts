import Layout from "./"
import initTestStore from "../../test/init-test-store"

let store, reduce
beforeEach(() => {
  store = initTestStore()
  reduce = store.dispatchAll
})

test("setting right side bar width", () => {
  const state = reduce([Layout.setRightSidebarWidth(299)])

  expect(Layout.getRightSidebarWidth(state)).toBe(299)
})

test("setting left side bar width", () => {
  const state = reduce([Layout.setLeftSidebarWidth(299)])

  expect(Layout.getLeftSidebarWidth(state)).toBe(299)
})

test("set column headers view off", () => {
  const state = store.dispatchAll([Layout.setColumnHeadersView("OFF")])

  expect(Layout.getColumnHeadersView(state)).toBe("OFF")
})

test("set column headers view on", () => {
  const state = store.dispatchAll([Layout.setColumnHeadersView("ON")])

  expect(Layout.getColumnHeadersView(state)).toBe("ON")
})

test("set column headers view auto", () => {
  const state = store.dispatchAll([Layout.setColumnHeadersView("AUTO")])

  expect(Layout.getColumnHeadersView(state)).toBe("AUTO")
})

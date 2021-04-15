import View from "./"
import initTestStore from "../../test/init-test-store"

let store, reduce
beforeEach(() => {
  store = initTestStore()
  reduce = store.dispatchAll
})

test("sets the timezone", () => {
  const actions = [View.setTimeZone("America/Los_Angeles")]
  const state = reduce(actions)
  expect(View.getTimeZone(state)).toBe("America/Los_Angeles")
})

test("timeZone defaults to UTC", () => {
  const state = store.getState()
  expect(View.getTimeZone(state)).toBe("UTC")
})

test("showing the downloads bar", () => {
  const state = reduce([View.showDownloads()])

  expect(View.getDownloadsIsOpen(state)).toBe(true)
})

test("hiding the downloads bar", () => {
  const state = reduce([View.showDownloads(), View.hideDownloads()])

  expect(View.getDownloadsIsOpen(state)).toBe(false)
})

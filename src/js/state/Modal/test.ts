import initTestStore from "../../test/init-test-store"
import Modal from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("show modal", () => {
  store.dispatch(Modal.show("whois", {addr: "129.3.2.1"}))

  const state = store.getState()

  expect(Modal.getName(state)).toEqual("whois")
  expect(Modal.getArgs(state)).toEqual({addr: "129.3.2.1"})
})

test("hide Modal", () => {
  const state = store.dispatchAll([
    Modal.show("whois", {addr: "129.3.2.1"}),
    Modal.hide()
  ])

  expect(Modal.getName(state)).toBe("")
  expect(Modal.getArgs(state)).toEqual({})
})

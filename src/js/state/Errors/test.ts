import Errors from "./"
import initTestStore from "../../test/init-test-store"

let store
beforeEach(() => {
  store = initTestStore()
})

test("ERROR_CREATE", () => {
  const state = store.dispatchAll([Errors.createError("Bug")])

  expect(Errors.getErrors(state)[0]).toEqual({
    type: "AppError",
    message: "Bug",
    details: []
  })
})

test("ERRORS_CLEAR", () => {
  const state = store.dispatchAll([
    Errors.createError("Bug"),
    Errors.createError("Bug2"),
    Errors.clearErrors()
  ])

  expect(Errors.getErrors(state)).toEqual([])
})

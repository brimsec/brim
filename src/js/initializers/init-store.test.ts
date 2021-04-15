import initTestStore from "../test/init-test-store"

test("initTestStore works with thunk and action log", () => {
  const store = initTestStore()

  store.dispatch({type: "A"})
  store.dispatch((dispatch) => dispatch({type: "B"}))
  store.dispatch({type: "C"})

  expect(store.getActions().map((a) => a.type)).toEqual(["A", "B", "C"])
})

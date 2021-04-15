import Histories from "app/core/models/histories"
import initTestStore from "src/js/test/init-test-store"
import TabHistories from "./index"

let store
beforeEach(() => {
  store = initTestStore()
})

test("save and select", () => {
  const h = new Histories()
  h.create("1")
  h.create("2")
  h.create("3")

  store.dispatch(TabHistories.save(h.serialize()))

  expect(TabHistories.selectAll(store.getState())).toEqual([
    {
      id: "1",
      entries: [{pathname: "/", search: "", hash: "", key: expect.any(String)}],
      index: 0
    },
    {
      id: "2",
      entries: [{pathname: "/", search: "", hash: "", key: expect.any(String)}],
      index: 0
    },
    {
      id: "3",
      entries: [{pathname: "/", search: "", hash: "", key: expect.any(String)}],
      index: 0
    }
  ])
})

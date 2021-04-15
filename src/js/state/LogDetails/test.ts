import LogDetails from "./"
import initTestStore from "../../test/init-test-store"
import {zjson, zng} from "zealot"

const columns = [
  {name: "_td", type: "count"},
  {name: "letter", type: "string"}
] as zjson.Column[]

const record = new zng.Record(columns, ["1", "a"])
const record2 = new zng.Record(columns, ["1", "b"])
const record3 = new zng.Record(columns, ["1", "c"])

let store
beforeEach(() => {
  store = initTestStore()
})

test("viewing a log detail", () => {
  const state = store.dispatchAll([LogDetails.push(record)])
  const log = LogDetails.build(state)

  expect(log && log.get("letter").toString()).toEqual("a")
})

test("viewing 2 logs", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2)
  ])

  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("b")
})

test("going back to the first log", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back()
  ])

  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("a")
})

test("going back and then forward", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back(),
    LogDetails.forward()
  ])

  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("b")
})

test("going back, then push, then back", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back(),
    LogDetails.push(record3),
    LogDetails.back()
  ])

  expect(
    LogDetails.build(state)
      .get("letter")
      .toString()
  ).toBe("a")
})

test("updating the current log detail", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.updateUidLogs([record, record2])
  ])

  expect(LogDetails.getUidLogs(state)).toEqual([record, record2])
  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("a")

  store.dispatch(LogDetails.updateUidStatus("FETCHING"))

  expect(LogDetails.getUidStatus(store.getState())).toBe("FETCHING")
})

import Tabs from "../Tabs"
import Viewer from "../Viewer"
import initTestStore from "../../test/init-test-store"
import {zng} from "zealot"

let store
let tabId
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([])
  tabId = Tabs.getActive(store.getState())
})

const conn = new zng.Record([{name: "ts", type: "time"}], ["1"])
const dns = new zng.Record([{name: "ts", type: "time"}], ["2"])
const http = new zng.Record([{name: "ts", type: "time"}], ["3"])

test("adding logs to the viewer", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [conn, dns]),
    Viewer.appendRecords(tabId, [http])
  ])

  expect(Viewer.getLogs(state).length).toEqual(3)
})

test("clear results", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [http]),
    Viewer.clear(tabId)
  ])

  expect(Viewer.getLogs(state)).toEqual([])
})

test("splice results", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [http]),
    Viewer.appendRecords(tabId, [http]),
    Viewer.appendRecords(tabId, [http]),
    Viewer.splice(tabId, 1)
  ])

  expect(Viewer.getLogs(state).length).toEqual(1)
})

test("results complete", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "COMPLETE")])

  expect(Viewer.getEndStatus(state)).toBe("COMPLETE")
})

test("results incomplete", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "INCOMPLETE")])

  expect(Viewer.getEndStatus(state)).toBe("INCOMPLETE")
})

test("results limited", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "LIMIT")])

  expect(Viewer.getEndStatus(state)).toBe("LIMIT")
})

test("update columns with same tds", () => {
  const cols1 = {
    "9d14c2039a78d76760aae879c7fd2c82": new zng.Schema([
      {name: "hello", type: "string"}
    ])
  }
  const cols2 = {
    "71f1b421963d31952e15edf7e3957a81": new zng.Schema([
      {name: "world", type: "string"}
    ])
  }
  const state = store.dispatchAll([
    Viewer.updateColumns(tabId, cols1),
    Viewer.updateColumns(tabId, cols2)
  ])

  expect(Viewer.getColumns(state)).toEqual({
    "9d14c2039a78d76760aae879c7fd2c82": new zng.Schema([
      {name: "hello", type: "string"}
    ]),
    "71f1b421963d31952e15edf7e3957a81": new zng.Schema([
      {name: "world", type: "string"}
    ])
  })
})

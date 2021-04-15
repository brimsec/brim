import {createColumn} from "./models/column"
import Columns from "./"
import actions from "./actions"
import initTestStore from "../../test/init-test-store"
import touch from "./touch"
import {zng} from "zealot"

const columns = {
  "1": new zng.Schema([
    {name: "_path", type: "string"},
    {name: "duration", type: "interval"}
  ]),
  "2": new zng.Schema([
    {name: "_path", type: "string"},
    {name: "ts", type: "time"}
  ])
}

let store
beforeEach(() => {
  store = initTestStore()
})

test("visibility false when at least one is hidden", () => {
  const prefName = "temp"
  const col = createColumn({name: "_path", type: "string"})
  const update = {[col.key]: {isVisible: false}}

  store.dispatch(actions.updateColumns(prefName, update))
  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toEqual({
    "_path:string": {isVisible: false},
    "duration:interval": {isVisible: false},
    "ts:time": {isVisible: false}
  })
})

test("visibility true when no preferences exist", () => {
  const prefName = "temp"

  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toEqual({
    "_path:string": {isVisible: true},
    "duration:interval": {isVisible: true},
    "ts:time": {isVisible: true}
  })
})

test("visibility true when all are visible", () => {
  const prefName = "temp"
  const col = createColumn({name: "_path", type: "string"})
  const col2 = createColumn({name: "duration", type: "interval"})
  const update = {
    [col.key]: {isVisible: true},
    [col2.key]: {isVisible: true}
  }

  store.dispatch(actions.updateColumns(prefName, update))
  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toEqual({
    "_path:string": {isVisible: true},
    "duration:interval": {isVisible: true},
    "ts:time": {isVisible: true}
  })
})

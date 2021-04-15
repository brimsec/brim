import Columns from "./"
import initTestStore from "../../test/init-test-store"

const tableId = "test"
let store
beforeEach(() => {
  store = initTestStore()
})
describe("Columns", () => {
  test("get initial state", () => {
    const state = store.getState()
    expect(Columns.getColumns(state)).toEqual({})
  })

  test("Bulk update column settings", () => {
    const state = store.dispatchAll([
      Columns.updateColumns(tableId, {
        "_path:string": {
          width: 22,
          isVisible: true,
          position: 0
        },
        "ts:time": {
          width: 200,
          isVisible: false,
          position: 1
        }
      }),
      Columns.updateColumns(tableId, {
        "_path:string": {isVisible: true, width: 100}
      })
    ])

    expect(Columns.getColumns(state)[tableId]).toEqual({
      "_path:string": {
        width: 100,
        isVisible: true,
        position: 0
      },
      "ts:time": {
        width: 200,
        isVisible: false,
        position: 1
      }
    })
  })

  test("hide one column", () => {
    const state = store.dispatchAll([
      Columns.hideColumn(tableId, {name: "a", type: "string"})
    ])

    const table = Columns.getColumns(state)[tableId]

    expect(table["a:string"]).toEqual({isVisible: false})
  })

  test("show one column", () => {
    const state = store.dispatchAll([
      Columns.hideColumn(tableId, {name: "a", type: "string"}),
      Columns.showColumn(tableId, {name: "a", type: "string"})
    ])

    const table = Columns.getColumns(state)[tableId]

    expect(table["a:string"]).toEqual({isVisible: true})
  })

  test("show all columns", () => {
    store.dispatch(
      Columns.updateColumns(tableId, {
        "a:string": {isVisible: false},
        "b:string": {isVisible: false},
        "c:string": {isVisible: false}
      })
    )

    const state = store.dispatchAll([Columns.showAllColumns(tableId)])

    const table = Columns.getColumns(state)[tableId]

    expect(table["a:string"]).toEqual({isVisible: true})
    expect(table["b:string"]).toEqual({isVisible: true})
    expect(table["c:string"]).toEqual({isVisible: true})
  })

  test("hide all columns", () => {
    store.dispatch(
      Columns.updateColumns(tableId, {
        "a:string": {isVisible: true},
        "b:string": {isVisible: true},
        "c:string": {isVisible: false}
      })
    )

    const state = store.dispatchAll([Columns.hideAllColumns(tableId)])

    const table = Columns.getColumns(state)[tableId]

    expect(table["a:string"]).toEqual({isVisible: false})
    expect(table["b:string"]).toEqual({isVisible: false})
    expect(table["c:string"]).toEqual({isVisible: false})
  })
})

import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import Columns from "src/js/state/Columns"
import Handlers from "src/js/state/Handlers"
import SearchBar from "src/js/state/SearchBar"
import Spaces from "src/js/state/Spaces"
import Viewer from "src/js/state/Viewer"
import Workspaces from "src/js/state/Workspaces"
import fixtures from "src/js/test/fixtures"
import initTestStore from "src/js/test/init-test-store"
import responses from "src/js/test/responses"
import {createZealotMock, zng} from "zealot"
import {viewerSearch} from "./viewer-search"

const dnsResp = responses("dns.txt")
const space = fixtures("space1")
const warningResp = responses("search_warning.txt")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())

  store.dispatchAll([
    Workspaces.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Spaces.setDetail("1", space)
  ])
  store.dispatch(tabHistory.push(lakePath(space.id, "1")))
})

const submit = () =>
  dispatch(
    viewerSearch({
      query: "dns query | head 500",
      from: new Date(),
      to: new Date(1)
    })
  )

describe("a normal response", () => {
  beforeEach(() => {
    zealot.stubStream("search", dnsResp)
  })

  test("zealot gets the request", async () => {
    await submit()
    const calls = zealot.calls("search")
    expect(calls.length).toBe(1)
    expect(calls[0].args).toEqual("dns query | head 500")
  })

  test("the table gets populated", async () => {
    await submit()
    expect(select(Viewer.getViewerRecords).length).toBe(2)
  })

  test("the table gets cleared", async () => {
    dispatch(
      Viewer.setRecords(undefined, [
        new zng.Record([{name: "clear", type: "string"}], ["me"])
      ])
    )
    await submit()
    expect(select(Viewer.getViewerRecords)[0]).not.toEqual([
      {name: "clear", type: "string", value: "me"}
    ])
  })

  test("the table status updates", async () => {
    const promise = submit()
    expect(select(Viewer.getStatus)).toBe("FETCHING")
    expect(select(Viewer.getEndStatus)).toBe("FETCHING")
    await promise
    expect(select(Viewer.getStatus)).toBe("SUCCESS")
    expect(select(Viewer.getEndStatus)).toBe("COMPLETE")
  })

  test("registers a table request then cleans it up", async () => {
    const promise = submit()
    expect(select(Handlers.get)["Table"]).toEqual(
      expect.objectContaining({type: "SEARCH"})
    )
    await promise
    expect(select(Handlers.get)["Table"]).toBe(undefined)
  })

  test("aborts previous table request", async () => {
    const abort = jest.fn()
    dispatch(Handlers.register("Table", {type: "SEARCH", abort}))
    await submit()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  test("sets the viewer columns", async () => {
    await submit()
    expect(select(Viewer.getColumns)).toMatchSnapshot()
  })

  test("sets the Columns columns", async () => {
    await submit()
    expect(select(Columns.getColumns)).toMatchSnapshot()
  })
})

test("a response with a warning", async () => {
  zealot.stubStream("search", warningResp)
  await submit()
  expect(select(SearchBar.getSearchBarError)).toBe(
    "Cut field boo not present in input"
  )
})

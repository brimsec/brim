import {createZealotMock} from "zealot"

import {submitSearch} from "../mod"
import Investigation from "../../../state/Investigation"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import fixtures from "../../../test/fixtures"
import initTestStore from "../../../test/init-test-store"
import responses from "../../../test/responses"
import Workspaces from "../../../state/Workspaces"
import {decodeSearchParams} from "app/search/utils/search-params"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"
import Current from "src/js/state/Current"
import brim from "src/js/brim"

const countByPathResp = responses("count_by_path.txt")
const dnsResp = responses("dns.txt")
const space = fixtures("space1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("search", countByPathResp).stubStream("search", dnsResp)
  store.dispatchAll([
    Workspaces.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Spaces.setDetail("1", space),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
  store.dispatch(tabHistory.push(lakePath("1", space.id)))
})
const submit = (...args) => dispatch(submitSearch(...args))

test("Always updates url", async () => {
  await submit({history: false, investigation: false})
  const record = decodeSearchParams(
    Current.getHistory(store.getState()).location.search
  )
  expect(record).toEqual({
    keep: false,
    pins: ["dns"],
    program: "query",
    spanArgs: brim.space(space).defaultSpanArgs(),
    spanArgsFocus: [null, null]
  })
})

test("saves to history", async () => {
  const start = Current.getHistory(store.getState()).length
  await submit()
  expect(Current.getHistory(store.getState()).length).toBe(start + 1)
})

test("does not save to history", async () => {
  const start = Current.getHistory(store.getState()).length
  await submit({history: false, investigation: true})
  expect(Current.getHistory(store.getState()).length).toBe(start)
})

test("saves to investigation", async () => {
  expect(select(Investigation.getInvestigation("1", "1")).length).toBe(0)
  await submit()
  expect(select(Investigation.getInvestigation("1", "1")).length).toBe(1)
})

test("does not save to investigation", async () => {
  expect(select(Investigation.getInvestigation("1", "1")).length).toBe(0)
  await submit({investigation: false, history: true})
  expect(select(Investigation.getInvestigation("1", "1")).length).toBe(0)
})

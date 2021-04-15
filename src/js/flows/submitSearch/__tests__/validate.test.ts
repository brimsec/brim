import {createZealotMock} from "zealot"

import {submitSearch} from "../mod"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import fixtures from "../../../test/fixtures"
import initTestStore from "../../../test/init-test-store"
import responses from "../../../test/responses"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

const dnsResp = responses("dns.txt")
const space = fixtures("space1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("search", dnsResp)
  store.dispatchAll([
    Spaces.setDetail("1", space),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
  store.dispatch(tabHistory.push(lakePath(space.id, "1")))
})
const submit = (...args) => dispatch(submitSearch(...args))

test("Validates the zql", () => {
  store.dispatch(tabHistory.push(`/workspaces/1/lakes/${space.id}/search`))
  expect(select(SearchBar.getSearchBarError)).toEqual(null)

  dispatch(SearchBar.changeSearchBarInput("_ath="))
  submit().catch((e) => e)

  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Expected [\s\S]* but end of input found\./
  )
})

test("Checks for parallel procs", () => {
  dispatch(
    SearchBar.changeSearchBarInput("files | split ( => count() => head 1)")
  )
  submit().catch((e) => e)
  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Parallel procs are not yet supported in Brim./
  )
})

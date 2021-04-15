import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import brim from "src/js/brim"
import {createZealotMock, zng} from "zealot"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude
} from "../../flows/searchBar/actions"
import {submitSearch} from "../../flows/submitSearch/mod"
import fixtures from "../../test/fixtures"
import initTestStore from "../../test/init-test-store"
import Url from "../Url"
import Search from "../Search"
import {SpanArgs} from "../Search/types"
import Spaces from "../Spaces"
import Workspaces from "../Workspaces"
import SearchBar from "./"
import {SearchBarState} from "./types"

let store, mock
beforeEach(() => {
  mock = createZealotMock()
  mock.stubStream("search", [], "always")
  store = initTestStore(mock.zealot)
  const workspace = fixtures("workspace1")
  const space = fixtures("space1")

  store.dispatchAll([
    Workspaces.add(workspace),
    Spaces.setDetail(workspace.id, space)
  ])
  store.dispatch(tabHistory.push(lakePath(space.id, workspace.id)))
})

test("input value changed", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("duration > 10")
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("duration > 10")
})

test("search pinned", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("_path = http"),
    SearchBar.pinSearchBar()
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("")
  expect(SearchBar.getSearchBarPins(state)).toEqual(["_path = http"])
})

test("search pin does not work if current is empty", () => {
  const state = store.dispatchAll([SearchBar.pinSearchBar()])

  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("search pin does not work if current is a bunch of white space", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("     "),
    SearchBar.pinSearchBar()
  ])
  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("search pin edit changes the pin", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first pin"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("second pin"),
    SearchBar.pinSearchBar(),
    SearchBar.editSearchBarPin(1, "update")
  ])

  expect(SearchBar.getSearchBarPins(state)).toEqual(["first pin", "update"])
})

test("editing a pin to an empty string removes it", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first"),
    SearchBar.pinSearchBar(),
    SearchBar.editSearchBarPin(0, "")
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "",
      pinned: []
    })
  )
})

test("search pin edit then submiting", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("second"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("third"),
    SearchBar.editSearchBarPin(0, "first (edited)")
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "third",
      pinned: ["first (edited)", "second"]
    })
  )
})

test("search bar pin remove", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first pin"),
    SearchBar.pinSearchBar(),
    SearchBar.removeSearchBarPin(0)
  ])

  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("search bar pin remove when out of bounds", () => {
  store.dispatch(SearchBar.removeSearchBarPin(100))

  expect(SearchBar.getSearchBarPins(store.getState())).toEqual([])
})

test("append an include field", () => {
  const data = new zng.Primitive("string", "conn")
  const field = new zng.Field("_path", data)
  const state = store.dispatchAll([appendQueryInclude(field)])

  expect(SearchBar.getSearchBarInputValue(state)).toBe('_path="conn"')
})

test("append an include field when some text already exists", () => {
  const data = new zng.Primitive("string", "conn")
  const field = new zng.Field("_path", data)
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("text"),
    appendQueryInclude(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe('text _path="conn"')
})

test("append an exclude field", () => {
  const data = new zng.Primitive("string", "conn")
  const field = new zng.Field("_path", data)
  const state = store.dispatchAll([appendQueryExclude(field)])
  expect(SearchBar.getSearchBarInputValue(state)).toBe('_path!="conn"')
})

test("append an exclude field when some text already exists", () => {
  const data = new zng.Primitive("string", "conn")
  const field = new zng.Field("_path", data)
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("text"),
    appendQueryExclude(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe('text _path!="conn"')
})

test("append a count by field", () => {
  const data = new zng.Primitive("string", "conn")
  const field = new zng.Field("_path", data)
  const state = store.dispatchAll([appendQueryCountBy(field)])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("* | count() by _path")
})

test("append a count to an existing query", () => {
  const data = new zng.Primitive("string", "ho ho")
  const field = new zng.Field("query", data)
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("dns"),
    appendQueryCountBy(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("dns | count() by query")
})

test("append a count to an existing query with a pin", () => {
  const data = new zng.Primitive("string", "heyo")
  const field = new zng.Field("query", data)
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    appendQueryCountBy(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("| count() by query")
})

test("edit pin then submit search", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("192.168.0.54"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("| count() by _path"),
    SearchBar.editSearchBarPin(0, "192.168.0.51")
  ])
  expect(SearchBar.getSearchProgram(state)).toBe(
    "192.168.0.51 | count() by _path"
  )
})

test("get search program", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("http"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("GET"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("| count() by host"),
    submitSearch()
  ])
  expect(SearchBar.getSearchProgram(state)).toBe("http GET | count() by host")
})

test("get search program returns star when empty", () => {
  const state = store.getState()
  expect(SearchBar.getSearchProgram(state)).toBe("*")
})

test("a search bar error", () => {
  const state = store.dispatchAll([
    SearchBar.errorSearchBarParse("not a valid shin dig")
  ])

  expect(SearchBar.getSearchBarError(state)).toBe("not a valid shin dig")
})

test("remove all pins", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("world"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("keep me"),
    SearchBar.removeAllSearchBarPins()
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("keep me")
  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("restore", () => {
  const slice: SearchBarState = {
    current: "restore",
    pinned: ["real", "quick"],
    error: null
  }
  const state = store.dispatchAll([SearchBar.restoreSearchBar(slice)])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("restore")
  expect(SearchBar.getSearchBarPins(state)).toEqual(["real", "quick"])
  expect(SearchBar.getSearchBarError(state)).toBe(null)
})

test("goBack", () => {
  store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    Search.setSpanArgsFromDates([new Date(1), new Date(2)]),
    submitSearch(),
    SearchBar.changeSearchBarInput("goodbye"),
    Search.setSpanArgsFromDates([new Date(3), new Date(4)]),
    submitSearch(),
    SearchBar.goBack()
  ])
  const {spanArgs, program} = Url.getSearchParams(store.getState())
  expect(brim.span(spanArgs as SpanArgs).toDateTuple()).toEqual([
    new Date(1),
    new Date(2)
  ])
  expect(program).toBe("hello")
})

test("goForward", () => {
  store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    Search.setSpanArgsFromDates([new Date(1), new Date(2)]),
    submitSearch(),
    SearchBar.changeSearchBarInput("goodbye"),
    Search.setSpanArgsFromDates([new Date(3), new Date(4)]),
    submitSearch(),
    SearchBar.changeSearchBarInput("hello again"),
    Search.setSpanArgsFromDates([new Date(5), new Date(6)]),
    submitSearch(),
    SearchBar.goBack(),
    SearchBar.goBack(),
    SearchBar.goForward()
  ])

  const {spanArgs, program} = Url.getSearchParams(store.getState())
  expect(brim.span(spanArgs as SpanArgs).toDateTuple()).toEqual([
    new Date(3),
    new Date(4)
  ])
  expect(program).toBe("goodbye")
})

test("clearSearchBar", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    SearchBar.clearSearchBar()
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "",
      error: null,
      pinned: []
    })
  )
})

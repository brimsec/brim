import {ZedField} from "zealot/zed/data-types"
import brim from "../../brim"
import {Cell, createCell} from "../../brim/cell"
import {onlyWhitespace} from "../../lib/Str"
import SearchBar from "../../state/SearchBar"
import {
  getSearchBar,
  getSearchBarInputValue
} from "../../state/SearchBar/selectors"
import {Thunk} from "../../state/types"

export function appendQueryInclude(field: ZedField): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .include(createCell(field))
          .string()
      )
    )
  }
}

export function appendQueryExclude(field: ZedField): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .exclude(createCell(field))
          .string()
      )
    )
  }
}

export function appendQueryCountBy(field: ZedField): Thunk {
  return function(dispatch, getState) {
    const {current, pinned} = getSearchBar(getState())
    const query = [...pinned, current].join(" ")
    const program = onlyWhitespace(query) ? "*" : current

    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(program)
          .countBy(createCell(field))
          .string()
      )
    )
  }
}

export function appendQuerySortBy(
  name: string,
  direction: "asc" | "desc"
): Thunk {
  return function(dispatch, getState) {
    const {current, pinned} = getSearchBar(getState())
    const query = [...pinned, current].join(" ")
    const program = onlyWhitespace(query) ? "*" : current

    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(program)
          .sortBy(name, direction)
          .string()
      )
    )
  }
}

export function appendQueryIn(field: Cell): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .in(field)
          .string()
      )
    )
  }
}

export function appendQueryNotIn(field: Cell): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .notIn(field)
          .string()
      )
    )
  }
}

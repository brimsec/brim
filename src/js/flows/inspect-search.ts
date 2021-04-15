import {Thunk} from "../state/types"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import {getZealot} from "./get-zealot"

type ReturnValue = {
  search: {
    method: string
    path: string
    body: string
  }
  program: string
  host: string
}

export const inspectSearch = (): Thunk<ReturnValue> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const program = SearchBar.getSearchProgram(getState())
  const [from, to] = Tab.getSpan(getState())
  const spaceId = Current.getSpaceId(getState())
  const host = Tab.workspaceUrl(getState())
  let search

  try {
    search = zealot.inspect.search(program, {from, to, spaceId})
  } catch (_) {
    // Parsing error
  }

  return {search, program, host}
}

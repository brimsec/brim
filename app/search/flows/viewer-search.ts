import md5 from "md5"
import {zng} from "zealot"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {search} from "src/js/flows/search/mod"
import {SearchResponse} from "src/js/flows/search/response"
import ErrorFactory from "src/js/models/error-factory"
import Columns from "src/js/state/Columns"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import SearchBar from "src/js/state/SearchBar"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Viewer from "src/js/state/Viewer"

type Args = {
  query: string
  from: Date
  to: Date
  keep?: boolean
  append?: boolean
}

const id = "Table"

export function viewerSearch(args: Args): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const {query, from, to, keep, append} = args
    const tabId = Tabs.getActive(getState())
    const spaceId = Current.mustGetSpace(getState()).id
    const {response, promise} = dispatch(search({id, query, from, to, spaceId}))
    dispatch(handle(response, tabId, keep, append))
    return promise
  }
}

function handle(
  response: SearchResponse,
  tabId: string,
  keep = false,
  append = false
): Thunk {
  return function(dispatch) {
    let allColumns = {}
    let allRecords = []
    let count = 0

    if (!keep && !append) {
      dispatch(Viewer.clear(tabId))
    }

    dispatch(Viewer.setStatus(tabId, "FETCHING"))
    dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(Viewer.setStatus(tabId, status)))
      .chan(0, (records, schemas: Map<number, zng.Schema>) => {
        count = records.length
        const columns = {}
        for (let schema of schemas.values()) {
          const hash = md5(JSON.stringify(schema.columns))
          columns[hash] = schema
        }

        if (keep) {
          allColumns = columns
          allRecords = records
          return
        }

        if (append) {
          dispatch(Viewer.appendRecords(tabId, records))
        } else {
          dispatch(Viewer.setRecords(tabId, records))
        }

        dispatch(Viewer.updateColumns(tabId, columns))
        dispatch(Columns.touch(columns))
      })
      .warnings((warning) => dispatch(SearchBar.errorSearchBarParse(warning)))
      .error((error) => {
        dispatch(Notice.set(ErrorFactory.create(error)))
      })
      .end(() => {
        if (keep) {
          dispatch(Viewer.clear(tabId))
          dispatch(Viewer.setRecords(tabId, allRecords))
          dispatch(Viewer.setColumns(tabId, allColumns))
          dispatch(Columns.touch(allColumns))
        }
        dispatch(Viewer.setEndStatus(tabId, endStatus(count)))
      })
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}

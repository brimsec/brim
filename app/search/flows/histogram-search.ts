import brim from "src/js/brim"
import {search} from "src/js/flows/search/mod"
import {SearchResponse} from "src/js/flows/search/response"
import ErrorFactory from "src/js/models/error-factory"
import {addEveryCountProc} from "src/js/searches/histogram-search"
import Chart from "src/js/state/Chart"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Url from "src/js/state/Url"

const id = "Histogram"

export function histogramSearch(): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const state = getState()
    const {program, spanArgs, pins} = Url.getSearchParams(state)
    const brimProgram = brim.program(program, pins)
    const [from, to] = brim.span(spanArgs).toDateTuple()
    const query = addEveryCountProc(brimProgram.string(), [from, to])
    const spaceId = Current.mustGetSpace(state).id
    const {response, promise} = dispatch(search({id, query, from, to, spaceId}))
    dispatch(handle(response))
    return promise
  }
}

function handle(response: SearchResponse): Thunk {
  return function(dispatch, getState) {
    const tabId = Tabs.getActive(getState())
    const params = Url.getSearchParams(getState())

    if (!params.keep) dispatch(Chart.clear(tabId))
    dispatch(Chart.setStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(Chart.setStatus(tabId, status)))
      .chan(0, (records) => dispatch(Chart.appendRecords(tabId, records)))
      .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))
  }
}

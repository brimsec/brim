import {createSelector} from "reselect"
import brim, {BrimSpace, Span} from "../../brim"
import {DateTuple} from "../../lib/time-window"
import Chart from "../Chart"
import Current from "../Current"
import {SpanArgs} from "../Search/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Url from "../Url"
import {SearchParams} from "../Url/selectors"
import Viewer from "../Viewer"
import {Workspace} from "../Workspaces/types"
import activeTabSelect from "./active-tab-select"
import {TabState} from "./types"

const workspaceUrl = createSelector<State, Workspace | null, string>(
  Current.getWorkspace,
  (c) => {
    if (c) return c.host + ":" + c.port
    else return "localhost:9867"
  }
)

export function tabIsFetching(tab: TabState) {
  return Viewer.isFetching(tab) || Chart.isFetching(tab)
}

const getSpan = createSelector<State, SearchParams, Span>(
  Url.getSearchParams,
  ({spanArgs}) => {
    return brim.span(spanArgs).toSpan()
  }
)

const getSpanFocus = createSelector<State, TabState, Span | null | undefined>(
  Tabs.getActiveTab,
  (tab) => tab.search.spanFocus
)

const getSpanArgs = createSelector<State, TabState, BrimSpace, SpanArgs>(
  Tabs.getActiveTab,
  Current.mustGetSpace,
  (tab, space) => {
    const [from, to] = tab.search.spanArgs
    const [defaultFrom, defaultTo] = space.defaultSpanArgs()
    return [from || defaultFrom, to || defaultTo]
  }
)

const getComputedSpan = createSelector<State, SpanArgs, Span>(
  getSpanArgs,
  (args) => {
    return brim.span(args).toSpan()
  }
)

const getSpanAsDates = createSelector<State, Span, DateTuple>(getSpan, (span) =>
  brim.span(span).toDateTuple()
)

const getSpanFocusAsDates = createSelector<
  State,
  Span | null | undefined,
  DateTuple | null | undefined
>(getSpanFocus, (focus) => {
  if (focus) {
    const [from, to] = focus
    return [brim.time(from).toDate(), brim.time(to).toDate()]
  } else {
    return null
  }
})

export default {
  workspaceUrl,
  getSpaceName: (state: State) => {
    const s = Current.mustGetSpace(state)
    return s ? s.name : ""
  },
  isFetching: activeTabSelect<boolean>(tabIsFetching),
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getComputedSpan
}

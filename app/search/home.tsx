import useIngestWatch from "app/search/hooks/use-ingest-watch"
import useColumns from "app/toolbar/hooks/use-columns"
import useExport from "app/toolbar/hooks/use-export"
import usePackets from "app/toolbar/hooks/use-packets"
import useView from "app/toolbar/hooks/use-view"
import {Toolbar} from "app/toolbar/toolbar"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {useLocation} from "react-router"
import {XDownloadProgress} from "src/js/components/download-progress"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchHeaderChart from "src/js/components/search-header-chart"
import SearchPageHeader from "src/js/components/search-page-header"
import SearchResults from "src/js/components/SearchResults/search-results"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Search from "src/js/state/Search"
import SearchBarState from "src/js/state/SearchBar"
import Url from "src/js/state/Url"

function syncReduxWithUrl() {
  return function(dispatch, getState) {
    const url = Url.getSearchParams(getState())
    if (url.keep) {
      // only update things that can be empty and have defaults
      if (Url.getSpanParams(getState()).every((time) => !time)) {
        dispatch(Search.setSpanArgs(url.spanArgs))
      }
    } else {
      dispatch(Search.setSpanArgs(url.spanArgs))
      dispatch(Search.setSpanFocus(url.spanArgsFocus))
      dispatch(
        SearchBarState.restoreSearchBar({
          current: url.program || "",
          pinned: url.pins,
          error: null
        })
      )
    }
  }
}

export function InitSearchParams({children}) {
  const dispatch = useDispatch()
  const location = useLocation()

  useLayoutEffect(() => {
    /**
     * Each time the url changes, we update the ui components to reflect whats in the url,
     */
    dispatch(syncReduxWithUrl())
  }, [location.key])

  return children
}

export default function SearchHome() {
  useIngestWatch()
  const dispatch = useDispatch()
  const view = useView()
  const packets = usePackets()
  const exportAction = useExport()
  const columns = useColumns()
  return (
    <InitSearchParams>
      <SearchPageHeader>
        <Toolbar
          submit={() => dispatch(submitSearch())}
          actions={[packets, exportAction, columns, view]}
        />
        <SearchBar />
        <SearchHeaderChart />
      </SearchPageHeader>

      <SearchResults />
      <XDownloadProgress />
    </InitSearchParams>
  )
}

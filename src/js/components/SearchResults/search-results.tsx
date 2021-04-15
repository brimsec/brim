import initialViewerSearch from "app/search/flows/initial-viewer-search"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {useLocation} from "react-router"
import {useResizeObserver} from "../hooks/use-resize-observer"
import {XResultsTable} from "./results-table"

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()
  const dispatch = useDispatch()
  const location = useLocation()

  useLayoutEffect(() => {
    dispatch(initialViewerSearch())
  }, [location.key])

  return (
    <div className="search-results" ref={ref}>
      <XResultsTable
        width={rect.width}
        height={rect.height}
        multiSelect={false}
      />
    </div>
  )
}

import useLakeId from "app/router/hooks/use-lake-id"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeSearchPath} from "app/router/utils/paths"
import useIngestWatch from "app/search/hooks/use-ingest-watch"
import useRefresh from "app/toolbar/hooks/use-refresh"
import useView from "app/toolbar/hooks/use-view"
import {Toolbar} from "app/toolbar/toolbar"
import Summary from "ppl/summary/summary"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect} from "react-router"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchPageHeader from "src/js/components/search-page-header"
import Feature from "src/js/state/Feature"
import changeSpan from "./flows/change-span"

function InitSummaryParams({children}) {
  useIngestWatch()
  return children
}

export default function SummaryHome() {
  const dispatch = useDispatch()
  const view = useView()
  const refresh = useRefresh()
  const show = useSelector(Feature.show("summary"))
  const lakeId = useLakeId()
  const workspaceId = useWorkspaceId()
  if (!show) return <Redirect to={lakeSearchPath(lakeId, workspaceId)} />
  return (
    <InitSummaryParams>
      <SearchPageHeader>
        <Toolbar
          submit={() => dispatch(changeSpan())}
          actions={[view, refresh]}
        />
        <SearchBar />
      </SearchPageHeader>
      <Summary />
    </InitSummaryParams>
  )
}

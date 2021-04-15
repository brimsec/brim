import useLakeId from "app/router/hooks/use-lake-id"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeSearch, lakeSummary} from "app/router/routes"
import {workspacePath} from "app/router/utils/paths"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import {initSpace} from "src/js/flows/init-space"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import SearchHome from "../search/home"
import SummaryHome from "../summary/home"

export default function LakeShow() {
  const match = useRouteMatch()
  return (
    <InitLake>
      <Switch>
        <Route path={lakeSearch.path}>
          <SearchHome />
        </Route>
        <Route path={lakeSummary.path}>
          <SummaryHome />
        </Route>
        <Route default>
          <Redirect to={`${match.url}/summary`} />
        </Route>
      </Switch>
    </InitLake>
  )
}

function InitLake({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useLakeId()
  const workspaceId = useWorkspaceId()
  const [fetching, setFetching] = useState(false)
  const lake = useSelector(Current.getSpace)

  useEffect(() => {
    if (lakeId) {
      setFetching(true)
      dispatch(initSpace(lakeId)).finally(() => setFetching(false))
    } else {
      setFetching(false)
    }
  }, [lakeId])

  if (fetching) return null
  if (!lake) return <Redirect to={workspacePath(workspaceId)} />
  return children
}

import {maybeShowReleaseNotes} from "app/release-notes/maybe-show-release-notes"
import ReleaseNotes from "app/release-notes/release-notes"
import AppRouter from "app/router/app-router"
import {
  releaseNotes,
  root,
  workspaceShow,
  workspacesList
} from "app/router/routes"
import AppWrapper from "app/routes/app-wrapper"
import WorkspacesList from "app/workspaces/list"
import WorkspaceShow from "app/workspaces/show"
import {ipcRenderer} from "electron"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch} from "react-router"
import useStoreExport from "../../../app/core/hooks/useStoreExport"
import brim from "../brim"
import Handlers from "../state/Handlers"
import Prefs from "../state/Prefs"
import View from "../state/View"
import useSearchShortcuts from "./useSearchShortcuts"

export default function App() {
  useStoreExport()
  const dispatch = useDispatch()
  brim.time.setZone(useSelector(View.getTimeZone))
  brim.time.setDefaultFormat(useSelector(Prefs.getTimeFormat))

  useSearchShortcuts()
  useEffect(() => {
    ipcRenderer.invoke("windows:ready")
    dispatch(maybeShowReleaseNotes())
    return () => {
      dispatch(Handlers.abortAll())
    }
  }, [])

  return (
    <AppRouter>
      <Switch>
        <Route path={workspaceShow.path}>
          <AppWrapper>
            <WorkspaceShow />
          </AppWrapper>
        </Route>
        <Route path={workspacesList.path}>
          <AppWrapper>
            <WorkspacesList />
          </AppWrapper>
        </Route>
        <Route path={releaseNotes.path}>
          <AppWrapper>
            <ReleaseNotes />
          </AppWrapper>
        </Route>
        <Route path={root.path}>
          <Redirect to="/workspaces/localhost:9867" />
        </Route>
      </Switch>
    </AppRouter>
  )
}

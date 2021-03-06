import {metaClient} from "app/ipc/meta"
import {releaseNotesPath} from "app/router/utils/paths"
import Current from "src/js/state/Current"
import Launches from "src/js/state/Launches"
import Tabs from "src/js/state/Tabs"

const isItest = process.env.BRIM_ITEST === "true"

export function maybeShowReleaseNotes() {
  return async (dispatch, getState) => {
    const version = await metaClient.version()
    if (!isItest && Launches.firstRunOfVersion(getState(), version)) {
      dispatch(showReleaseNotes())
      dispatch(Launches.touchVersion(version))
    }
  }
}

export function showReleaseNotes() {
  return (dispatch, getState) => {
    const id = Current.getWorkspaceId(getState())
    dispatch(Tabs.new(releaseNotesPath(id)))
  }
}

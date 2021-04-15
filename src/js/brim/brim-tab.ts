import {whichRoute} from "app/router/routes"
import {decodeSearchParams} from "app/search/utils/search-params"
import get from "lodash/get"
import {SpacesState} from "../state/Spaces/types"
import {TabState} from "../state/Tab/types"
import {WorkspacesState} from "../state/Workspaces/types"

export default function(
  tab: TabState,
  workspaces: WorkspacesState,
  lakes: SpacesState
) {
  return {
    title() {
      const history = global.tabHistories.getOrCreate(tab.id)
      const route = whichRoute(history.location.pathname)
      if (route) {
        return compileTitle(route, history.location, workspaces, lakes)
      } else {
        return "Brim"
      }
    }
  }
}

/**
 * Replaces keywords like <workspace> <lake> <program> with the
 * actual names of the current workspace lake and program.
 */
function compileTitle(route, location, workspaces, lakes) {
  let title = route.title
  const {workspaceId, lakeId} = route.match.params
  if (workspaceId) {
    title = title.replace(
      "<workspace>",
      get(workspaces, [workspaceId, "name"], "")
    )
    if (lakeId) {
      title = title.replace(
        "<lake>",
        get(lakes, [workspaceId, lakeId, "name"], "")
      )
    }
  }
  const {program} = decodeSearchParams(location.search)
  title = title.replace("<program>", program || "Search")
  return title
}

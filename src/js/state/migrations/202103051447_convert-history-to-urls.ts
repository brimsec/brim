import {lakeSearchPath} from "app/router/utils/paths"
import {getAllStates, getAllTabs} from "src/js/test/helpers/get-test-state"
import {parsePath} from "history"

/**
 * We never stored the workspace id in the search records. This was probably
 * because it was only ever localhost:9867. So we'll have to assume for sake
 * of this migration that all the search records are in localhost:9867.
 */
const toUrl = (e) => parsePath(lakeSearchPath(e.spaceId, "localhost:9867", e))

export default function convertHistoryToUrls(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue

    /**
     * Move all tab histories into their url format
     */
    const tabHistories = s.tabs.data.map((tab) => ({
      id: tab.id,
      index: tab.history.position,
      entries: tab.history.entries.map(toUrl)
    }))
    const ids = tabHistories.map((e) => e.id)
    const entities = tabHistories.reduce((a, e) => ({...a, [e.id]: e}), {})
    s.tabHistories = {ids, entities} // The Entity Adapter format
  }

  /**
   * Delete tab.history, current, and last
   */
  for (const tab of getAllTabs(state)) {
    delete tab.history
    delete tab.current
    delete tab.last
  }

  return state
}

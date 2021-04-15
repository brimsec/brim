import getTestState from "../../test/helpers/get-test-state"
import migrate from "./202005181140_search-state-space-id"

const getWinStates = (sess) =>
  Object.values(sess.windows).map((w: any) => w.state)
const getTabs = (state) => state.tabs.data
const getNameId = (tab) => [tab.search.spaceName, tab.search.spaceId]

test("migrating 202005181140_searchStateSpaceId", () => {
  const prev = getTestState("v0.9.1")
  expect(getWinStates(prev).length).toBe(1)

  const next = migrate(prev)
  expect(getWinStates(next).length).toBe(1)

  for (const state of getWinStates(next)) {
    const tabs = getTabs(state)

    // Check that it removes the old key
    for (const tab of tabs) expect(tab.search.space).toBe(undefined)

    // Check each tab for the expected migration
    expect(getNameId(tabs[0])).toEqual(["", ""])
    expect(getNameId(tabs[1])).toEqual(["pcaps.brim", "pcaps.brim"])
    expect(getNameId(tabs[2])).toEqual(["", ""])
  }
})

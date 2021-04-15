import {getAllTabs} from "src/js/test/helpers/get-test-state"
import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202103051428_removeSearchBarFields", async () => {
  const next = await migrate({state: "v0.24.0", to: "202103051428"})

  const tabs = getAllTabs(next)

  expect(tabs[0].searchBar).toEqual({
    current: "tab 0 history 2",
    error: null,
    pinned: []
  })

  expect(tabs[1].searchBar).toEqual({
    current: "history entry with pins",
    error: null,
    pinned: ["james", "kerr", "pins"]
  })
})

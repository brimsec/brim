import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202012011232_sidebarSections", async () => {
  const next = await migrate({state: "v0.17.0", to: "202012011232"})

  const windows = Object.values(next.windows)
  // @ts-ignore
  for (const {state} of windows) {
    for (const tab of state.tabs.data) {
      expect(tab.layout.sidebarSections).toEqual([
        {id: "spaces", isOpen: true},
        {id: "history", isOpen: true}
      ])
      expect(tab.layout.spacesIsOpen).toBe(undefined)
      expect(tab.layout.historyIsOpen).toBe(undefined)
      // I decided the height of each section isn't worth saving during the migration
      // we'll just reset the heights to be evenly distributed on first load,
      // they'll be saved from then on.
      expect(tab.layout.spacesHeight).toBe(undefined)
      expect(tab.layout.historyHeight).toBe(undefined)
    }
  }
})

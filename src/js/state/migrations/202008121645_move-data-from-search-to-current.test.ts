import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202008121645_moveDataFromSearchToCurrent", async () => {
  const next = await migrate({state: "v0.14.0", to: "202008121645"})

  // @ts-ignore
  const tabs = Object.values(next.windows).flatMap((win) => win.state.tabs.data)

  expect(tabs[0].search.clusterId).toBe(undefined)
  expect(tabs[0].search.spaceId).toBe(undefined)
  expect(tabs[1].search.clusterId).toBe(undefined)
  expect(tabs[1].search.spaceId).toBe(undefined)

  expect(tabs[0].current.connectionId).toBe("zqd")
  expect(tabs[0].current.spaceId).toBe("sp_1fmLWxg0lO32tIbQMIEtUBjT4Ot")
  expect(tabs[1].current.connectionId).toBe("zqd")
  expect(tabs[1].current.spaceId).toBe("sp_1fmLUuIyIEKk4iFQAL6oqM8wj31")
})

import {getAllTabs} from "src/js/test/helpers/get-test-state"
import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202103051447_convertHistoryToUrls", async () => {
  const next = await migrate({state: "v0.24.0", to: "202103051447"})

  const window = next.windows["bfe372abb9"].state

  for (const tab of getAllTabs(next)) {
    expect(tab.history).toBe(undefined)
    expect(tab.current).toBe(undefined)
    expect(tab.last).toBe(undefined)
  }

  expect(window.tabHistories).toEqual({
    ids: ["1a28bd1355", "7f1a3e37ed"],
    entities: {
      "1a28bd1355": {
        id: "1a28bd1355",
        index: 3,
        entries: [
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pELx46A58E7CQIEEFn6rWSZ6iS/search",
            search: "?from=0.0&to=0.1000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pELx46A58E7CQIEEFn6rWSZ6iS/search",
            search: "?from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pELx46A58E7CQIEEFn6rWSZ6iS/search",
            search:
              "?q=tab+0&from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pELx46A58E7CQIEEFn6rWSZ6iS/search",
            search:
              "?q=tab+0+history+2&from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          }
        ]
      },
      "7f1a3e37ed": {
        id: "7f1a3e37ed",
        index: 5,
        entries: [
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pDv4pfSflu9NpIQ9NXjV5Lw0jm/search",
            search: "?from=0.0&to=0.1000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pDv4pfSflu9NpIQ9NXjV5Lw0jm/search",
            search: "?from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pDv4pfSflu9NpIQ9NXjV5Lw0jm/search",
            search:
              "?q=history+entry+1&from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pDv4pfSflu9NpIQ9NXjV5Lw0jm/search",
            search:
              "?q=history+entry+2&from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pDv4pfSflu9NpIQ9NXjV5Lw0jm/search",
            search:
              "?q=history+entry+3&from=1585846170.901824000&to=1585852169.492000000",
            hash: ""
          },
          {
            pathname:
              "/workspaces/localhost:9867/lakes/sp_1pDv4pfSflu9NpIQ9NXjV5Lw0jm/search",
            search:
              "?q=history+entry+with+pins&from=1585846170.901824000&to=1585852169.492000000&p0=james&p1=kerr&p2=pins",
            hash: ""
          }
        ]
      }
    }
  })
})

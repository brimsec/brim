import {migrate} from "src/js/test/helpers/migrate"
import {getAllStates} from "../../test/helpers/get-test-state"

test("migrating 202103011928_adjustWindowsNetworkingActivityQuery", async () => {
  const next = await migrate({state: "v0.23.0", to: "202103011928"})
  expect.assertions(3)

  const updatedQuery = {
    id: "3",
    name: "Windows Networking Activity",
    value: "_path=smb* OR _path=dce_rpc",
    description:
      "Filters and displays smb_files, smb_mapping and DCE_RPC activity",
    tags: ["windows", "smb", "malware"]
  }

  for (const state of getAllStates(next)) {
    const targetQuery = Object.values(state.queries.items).find(({id}) => {
      return id === "3"
    })
    expect(targetQuery).toEqual(updatedQuery)
  }
})

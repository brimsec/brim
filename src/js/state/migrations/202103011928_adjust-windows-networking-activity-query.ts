import {getAllStates} from "../../test/helpers/get-test-state"
import isEqual from "lodash/isEqual"

export default function adjustWindowsNetworkingActivityQuery(state: any) {
  const shippedQuery = {
    id: "3",
    name: "Windows Networking Activity",
    value: "_path=~smb* OR _path=dce_rpc",
    description:
      "Filters and displays smb_files, smb_mapping and DCE_RPC activity",
    tags: ["windows", "smb", "malware"]
  }

  for (const s of getAllStates(state)) {
    if (!s.queries) continue
    const targetQuery = Object.values(s.queries.items).find(({id}) => {
      return id === "3"
    })
    if (targetQuery && isEqual(targetQuery, shippedQuery)) {
      // @ts-ignore
      targetQuery.value = "_path=smb* OR _path=dce_rpc"
    }
  }

  return state
}

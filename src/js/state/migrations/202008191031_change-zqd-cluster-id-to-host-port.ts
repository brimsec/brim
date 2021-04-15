import {getAllStates} from "../../test/helpers/get-test-state"

export default function changeZqdClusterIdToHostPort(state: any) {
  const oldId = "zqd"
  const newHost = "localhost"
  const newPort = "9867"
  const newId = `${newHost}:${newPort}`

  for (const s of getAllStates(state)) {
    if (!s.clusters) continue
    // rename cluster
    s.clusters[newId] = {
      id: newId,
      host: newHost,
      port: newPort
    }
    delete s.clusters[oldId]

    for (const t of s.tabs.data) {
      // rename current
      if (!t.current) continue
      if (t.current.connectionId === oldId) t.current.connectionId = newId
    }
  }

  return state
}

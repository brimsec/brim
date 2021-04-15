import {getAllStates} from "../../test/helpers/get-test-state"

export default function spacesStateId(sess: any) {
  for (const s of getAllStates(sess)) {
    for (const clusterId in s.spaces) {
      const cluster = s.spaces[clusterId]
      if (!cluster) continue

      for (const spaceId in cluster) {
        const space = cluster[spaceId]
        if (!space) continue

        space.id = space.name
        space.pcap_support = space.packet_support
        delete space.packet_support
      }
    }
  }

  return sess
}

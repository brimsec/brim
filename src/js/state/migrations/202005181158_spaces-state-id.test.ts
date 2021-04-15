import getTestState from "../../test/helpers/get-test-state"
import migrate from "./202005181158_spaces-state-id"

test("migrating 202005181158_spacesStateId", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  expect(next.globalState.spaces).toEqual({
    zqd: {
      "pcaps.brim": {
        id: "pcaps.brim",
        ingest: {
          progress: null,
          snapshot: 0,
          warnings: []
        },
        max_time: {
          ns: 140103001,
          sec: 1428917565
        },
        min_time: {
          ns: 47800000,
          sec: 1425567042
        },
        name: "pcaps.brim",
        packet_path: "",
        packet_size: 0,
        pcap_support: false,
        size: 50281455
      }
    }
  })
})

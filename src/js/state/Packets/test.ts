import Packets from "./"
import initTestStore from "../../test/init-test-store"

let store

beforeEach(() => {
  store = initTestStore()
})

const reduce = (actions) => store.dispatchAll(actions)

test("requesting packets", () => {
  const state = reduce([Packets.request("123")])

  expect(Packets.getDownloads(state)[0]).toEqual({
    uid: "123",
    percentComplete: 0,
    error: null
  })
})

test("receiving packets", () => {
  const uid = "123"
  const state = reduce([Packets.request(uid), Packets.receive(uid, "123.pcap")])

  expect(Packets.getDownloads(state)[0]).toEqual({
    uid,
    percentComplete: 1,
    error: null
  })
})

test("error with the packets", () => {
  const uid = "123"
  const state = reduce([
    Packets.request(uid),
    Packets.error(uid, "boom goes the dyno")
  ])

  expect(Packets.getDownloads(state)[0]).toEqual({
    uid,
    percentComplete: 0.0,
    error: "boom goes the dyno"
  })
})

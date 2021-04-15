import tabHistory from "app/router/tab-history"
import {workspacePath} from "app/router/utils/paths"
import {createZealotMock} from "zealot"
import lib from "../lib"
import Current from "../state/Current"
import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Workspaces from "../state/Workspaces"
import fixtures from "../test/fixtures"
import initTestStore from "../test/init-test-store"
import {itestFile, itestFilePath} from "../test/itest-file"
import ingestFiles from "./ingest-files"

let store, zealot
beforeEach(() => {
  zealot = createZealotMock()
    .stubPromise("spaces.create", {
      name: "sample.pcap.brim",
      id: "spaceId"
    })
    .stubPromise(
      "spaces.get",
      {
        name: "sample.pcap.brim",
        id: "spaceId",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        pcap_support: true
      },
      "always"
    )
    .stubPromise("spaces.delete", true)
  const ws = fixtures("workspace1")

  store = initTestStore(zealot.zealot)
  store.dispatchAll([Workspaces.add(ws)])
  store.dispatch(tabHistory.push(workspacePath(ws.id)))
})

describe("success case", () => {
  beforeEach(() => {
    zealot.stubStream("pcaps.post", [
      {type: "TaskStart", task_id: 1},
      {
        type: "PcapPostStatus",
        snapshot_count: 1,
        start_time: {sec: 0, ns: 0},
        update_time: {sec: 1, ns: 1},
        pcap_total_size: 100,
        pcap_read_size: 1
      },
      {type: "TaskEnd", task_id: 1}
    ])
  })

  test("opening a pcap", async () => {
    await store.dispatch(ingestFiles([itestFile("sample.pcap")]))

    const state = store.getState()
    expect(Tab.getSpaceName(state)).toEqual("sample.pcap.brim")
    expect(Current.mustGetSpace(state)).toEqual(
      expect.objectContaining({
        name: "sample.pcap.brim",
        id: "spaceId",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        pcap_support: true,
        ingest: {
          progress: null,
          warnings: [],
          snapshot: 1
        }
      })
    )
  })

  test("register a handler with a space id", async () => {
    await store.dispatch(ingestFiles([itestFile("sample.pcap")]))

    const handler = store
      .getActions()
      .find((a) => a.type === "HANDLERS_REGISTER")

    expect(handler).toEqual({
      type: "HANDLERS_REGISTER",
      handler: {type: "INGEST", spaceId: "spaceId"},
      id: expect.any(String)
    })
  })

  test("a zeek ingest error", async () => {
    zealot.stubStream("logs.post", [{type: "TaskEnd", error: {error: "Boom"}}])

    await expect(
      store.dispatch(ingestFiles([itestFile("sample.tsv")]))
    ).rejects.toEqual(expect.any(Error))

    const state = store.getState()
    expect(Current.getSpaceId(state)).toEqual(null)
  })

  test("a json file with a custom types config", async () => {
    zealot.stubStream("logs.post", [{type: "LogPostStatus"}, {type: "TaskEnd"}])

    const contents = await lib.file(itestFilePath("sampleTypes.json")).read()
    store.dispatch(Prefs.setJSONTypeConfig(itestFilePath("sampleTypes.json")))

    await store.dispatch(ingestFiles([itestFile("sample.ndjson")]))

    expect(zealot.calls("logs.post")[0].args).toEqual({
      files: [itestFile("sample.ndjson")],
      spaceId: "spaceId",
      types: JSON.parse(contents)
    })
  })
})

describe("error case", () => {
  test("task end error", async () => {
    zealot.stubStream("pcaps.post", [{type: "TaskEnd", error: {error: "Boom"}}])

    await expect(
      store.dispatch(ingestFiles([itestFile("sample.pcap")]))
    ).rejects.toEqual(expect.any(Error))

    const state = store.getState()
    const workspace = Current.getWorkspaceId(state)
    expect(Spaces.getSpaces(workspace)(state)).toEqual([])
    expect(Spaces.getSpaces(workspace)(state)).toEqual([])
    expect(Current.getSpaceId(state)).toEqual(null)
  })

  test("pcap post warning", async () => {
    zealot.stubStream("pcaps.post", [
      {type: "PcapPostWarning", warning: "Some pcap warning"}
    ])

    await store.dispatch(ingestFiles([itestFile("sample.pcap")]))

    const state = store.getState()
    const wsId = Current.getWorkspaceId(state)
    const spaceId = Current.getSpaceId(state)
    expect(Spaces.getIngestWarnings(wsId, spaceId)(state)).toEqual([
      "Some pcap warning"
    ])
  })

  test("pcap post file not found", async () => {
    zealot.stubError("pcaps.post", {
      type: "Error",
      kind: "item does not exist",
      error: "file:///Users/phil/pcap/hello.pcapng"
    })
    await expect(
      store.dispatch(ingestFiles([itestFile("sample.pcap")]))
    ).rejects.toThrow(
      new RegExp(
        "File file:///Users/phil/pcap/hello.pcapng does not exist on testName1"
      )
    )
  })
})

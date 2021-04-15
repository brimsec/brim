import {lakePath, workspacesPath} from "app/router/utils/paths"
import fsExtra from "fs-extra"
import {isEmpty} from "lodash"
import brim from "../brim"
import ingest from "../brim/ingest"
import {IngestParams} from "../brim/ingest/get-params"
import errors from "../errors"
import lib from "../lib"
import Current from "../state/Current"
import Handlers from "../state/Handlers"
import {Handler} from "../state/Handlers/types"
import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import SystemTest from "../state/SystemTest"
import Tabs from "../state/Tabs"
import {Thunk} from "../state/types"
import {getZealot} from "./get-zealot"

export default (files: File[]): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const ws = Current.mustGetWorkspace(getState())
  const workspaceId = ws.id
  const zealot = dispatch(getZealot())
  const tabId = Tabs.getActive(getState())
  const requestId = brim.randomHash()
  const jsonTypeConfigPath = Prefs.getJSONTypeConfig(getState())
  const dataDir = Prefs.getDataDir(getState())
  const spaceNames = Spaces.getSpaceNames(workspaceId)(getState())

  dispatch(SystemTest.hook("import-start"))
  return lib
    .transaction([
      validateInput(files, dataDir, spaceNames),
      createDir(),
      createSpace(zealot, dispatch, workspaceId),
      setSpace(dispatch, tabId, workspaceId),
      registerHandler(dispatch, requestId),
      postFiles(zealot, ws, jsonTypeConfigPath),
      trackProgress(zealot, dispatch, workspaceId),
      unregisterHandler(dispatch, requestId)
    ])
    .then(() => {
      dispatch(SystemTest.hook("import-complete"))
    })
}

const validateInput = (files: File[], dataDir, spaceNames) => ({
  async do() {
    const params = await ingest
      .detectFileTypes(files)
      .then((data) => ingest.getParams(data, dataDir, spaceNames))
      .catch((e) => {
        if (e.message.startsWith("EISDIR"))
          throw new Error(
            "Importing directories is not yet supported. Select multiple files."
          )
        else throw e
      })
    if ("error" in params) throw new Error(params.error)
    return params
  }
})

const createDir = () => ({
  async do({dataDir}: IngestParams) {
    dataDir && (await fsExtra.ensureDir(dataDir))
  },
  async undo({dataDir}: IngestParams) {
    dataDir && (await fsExtra.remove(dataDir))
  }
})

const createSpace = (client, gDispatch, workspaceId) => ({
  async do(params: IngestParams) {
    let createParams
    if (params.dataDir) {
      createParams = {data_path: params.dataDir}
    } else {
      createParams = {name: params.name}
    }
    const space = await client.spaces.create(createParams)
    gDispatch(
      Spaces.setDetail(workspaceId, {
        ...space,
        ingest: {progress: 0, snapshot: 0, warnings: []}
      })
    )

    return {...params, spaceId: space.id}
  },
  async undo({spaceId}: IngestParams & {spaceId: string}) {
    await client.spaces.delete(spaceId)
    gDispatch(Spaces.remove(workspaceId, spaceId))
  }
})

const registerHandler = (dispatch, id) => ({
  do({spaceId}: IngestParams & {spaceId: string}) {
    const handle: Handler = {type: "INGEST", spaceId}
    dispatch(Handlers.register(id, handle))
  },
  undo() {
    dispatch(Handlers.remove(id))
  }
})

const unregisterHandler = (dispatch, id) => ({
  do() {
    dispatch(Handlers.remove(id))
  }
})

const postFiles = (client, ws, jsonTypesPath) => ({
  async do(params: IngestParams & {spaceId: string}) {
    const {spaceId, endpoint, files} = params
    const paths = files.map((f) => f.path)
    let stream
    if (endpoint === "pcap") {
      try {
        stream = await client.pcaps.post({spaceId, path: paths[0]})
      } catch (e) {
        if (e.name == "item does not exist") {
          e.message = "File " + e.message + " does not exist on " + ws.name
        }
        throw e
      }
    } else {
      const types = isEmpty(jsonTypesPath)
        ? undefined
        : await lib
            .file(jsonTypesPath)
            .read()
            .then(JSON.parse)
      stream = await client.logs.post({spaceId, files, types})
    }
    return {...params, stream}
  }
})

const setSpace = (dispatch, tabId, workspaceId) => ({
  do({spaceId}) {
    const url = lakePath(spaceId, workspaceId)
    global.tabHistories.getOrCreate(tabId).push(url)
  },
  undo() {
    const url = workspacesPath()
    global.tabHistories.getOrCreate(tabId).replace(url)
  }
})

const trackProgress = (client, gDispatch, workspaceId) => {
  return {
    async do({spaceId, stream, endpoint}) {
      const space = Spaces.actionsFor(workspaceId, spaceId)

      async function updateSpaceDetails() {
        const details = await client.spaces.get(spaceId)
        gDispatch(Spaces.setDetail(workspaceId, details))
      }

      function packetPostStatusToPercent(status): number {
        if (status.pcap_total_size === 0) return 1
        else return status.pcap_read_size / status.pcap_total_size || 0
      }

      gDispatch(space.setIngestProgress(0))
      for await (const {type, ...status} of stream) {
        switch (type) {
          case "PcapPostStatus":
            gDispatch(
              space.setIngestProgress(packetPostStatusToPercent(status))
            )
            gDispatch(space.setIngestSnapshot(status.snapshot_count))
            if (status.snapshot_count > 0) updateSpaceDetails()
            break
          case "UploadProgress":
            gDispatch(space.setIngestProgress(status.progress))
            updateSpaceDetails()
            break
          case "LogPostResponse":
            updateSpaceDetails()
            if (status.warnings) {
              status.warnings.forEach((warning) => {
                gDispatch(space.appendIngestWarning(warning))
              })
            }
            break
          case "LogPostWarning":
          case "PcapPostWarning":
            gDispatch(space.appendIngestWarning(status.warning))
            break
          case "TaskEnd":
            if (status.error) {
              if (endpoint === "pcap") {
                throw errors.pcapIngest(status.error.error)
              } else {
                throw errors.logsIngest(status.error.error)
              }
            }
            break
        }
      }
      await updateSpaceDetails()
      gDispatch(space.setIngestProgress(1))
      gDispatch(space.setIngestProgress(null))
    }
  }
}

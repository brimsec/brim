import {join} from "path"
import {remote} from "electron"

import {Thunk} from "../types"
import {saveToFile} from "../../lib/response"
import Current from "../Current"
import Packets from "../Packets"
import View from "../View"
import {getZealot} from "../../flows/get-zealot"
import {zng} from "zealot"

export default {
  fetch: (log: zng.Record): Thunk<Promise<string>> => (
    dispatch: Function,
    getState: Function
  ) => {
    dispatch(Packets.request(log.get("uid").toString()))
    dispatch(View.showDownloads())
    const state = getState()
    const zealot = dispatch(getZealot())
    const spaceId = Current.getSpaceId(state)
    const ts = log.get("ts") as zng.Primitive
    const dur = log.get("duration") as zng.Primitive
    const args = {
      ts_sec: getSec(ts),
      ts_ns: getNs(ts),
      duration_sec: getSec(dur),
      duration_ns: getNs(dur),
      proto: log.get("proto").toString(),
      src_host: log.get("id.orig_h").toString(),
      src_port: log.get("id.orig_p").toString(),
      dst_host: log.get("id.resp_h").toString(),
      dst_port: log.get("id.resp_p").toString(),
      spaceId
    }
    const destDir = remote.app.getPath("temp")
    const dest = join(destDir, `packets-${args.ts_sec + args.ts_ns / 1e9}.pcap`)
    return zealot.pcaps
      .get(args)
      .then((resp) => saveToFile(resp, dest))
      .then((file) => {
        dispatch(Packets.receive(log.get("uid").toString(), file))
        return file
      })
      .catch((error) => {
        dispatch(Packets.error(log.get("uid").toString(), error))
        throw error
      })
      .finally(() => {
        setTimeout(() => dispatch(View.hideDownloads()), 5000)
      })
  }
}

function getSec(data: zng.Primitive): number {
  if (data.isSet()) {
    return parseInt(data.getValue().split(".")[0])
  } else {
    return 0
  }
}

function getNs(data: zng.Primitive): number {
  if (data.isSet()) {
    const v = data.getValue().split(".")
    if (v.length === 2) {
      const frac = v[1]
      const digits = frac.length
      return parseInt(frac) * Math.pow(10, 9 - digits)
    }
  }
  return 0
}

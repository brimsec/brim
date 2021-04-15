import {LogsPostArgs, LogsPostPathsArgs} from "../types"
import {getDefaultJsonTypeConfig} from "../config/json-types"

export default {
  post({spaceId, files, types}: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log`,
      body: getBody(files, types)
    }
  },
  postPaths({spaceId, paths, types}: LogsPostPathsArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log/paths`,
      body: getPathsBody(paths, types)
    }
  }
}

function getBody(files: File[] | FileList, types = getDefaultJsonTypeConfig()) {
  const data = new FormData()
  data.append("json_config", JSON.stringify(types))
  for (const file of files) {
    data.append(file.name, file)
  }
  return data
}

function getPathsBody(paths: string[], types = getDefaultJsonTypeConfig()) {
  return JSON.stringify({paths, json_type_config: types})
}

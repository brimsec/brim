import path from "path"

import {IngestFileType} from "./detect-file-type"
import {getUniqName} from "../../lib/uniq-name"
import fileList, {FileListData} from "./file-list"
import lib from "../../lib"
import time from "../time"

export type IngestParams = {
  name: string
  dataDir: string
  endpoint: IngestFileType
  files: File[]
}

export type IngestParamsError = {
  error: string
}

export default function getParams(
  data: FileListData,
  dataDir?: string,
  existingNames: string[] = [],
  now: Date = new Date()
): IngestParams | IngestParamsError {
  const files = fileList(data)

  if (files.multiple() && files.any("pcap")) {
    return {
      error: "Only one pcap can be opened at a time."
    }
  }

  function getDataDir() {
    return dataDir ? path.join(dataDir, getSpaceName()) : ""
  }

  function getSpaceName() {
    let name
    if (files.oneFile()) name = lib.file(files.first().file.path).fileName()
    else if (files.inSameDir()) name = files.dirName()
    else name = generateDirName(now)

    return getUniqName(name, existingNames)
  }

  return {
    name: getSpaceName(),
    dataDir: getDataDir(),
    endpoint: files.first().type,
    files: files.files()
  }
}

function generateDirName(now) {
  return "zeek_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}

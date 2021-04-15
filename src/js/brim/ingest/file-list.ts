import {IngestFileType} from "./detect-file-type"
import lib from "../../lib"

export type FileListData = {type: IngestFileType; file: File}[]

export default function fileList(list: FileListData) {
  return {
    first() {
      return list[0]
    },

    oneFile() {
      return list.length === 1
    },

    multiple() {
      return list.length > 1
    },

    paths(): string[] {
      return list.map((f) => f.file.path)
    },

    files(): File[] {
      return list.map((f) => f.file)
    },

    any(type: string) {
      return !!list.find((f) => f.type === type)
    },

    allPcap() {
      return list.every((f) => f.type === "pcap")
    },

    mixed() {
      return !list.every((f) => f.type === list[0].type)
    },

    inSameDir() {
      return list.every(
        (item) =>
          lib.file(item.file.path).dirName() ===
          lib.file(list[0].file.path).dirName()
      )
    },

    dirName() {
      return lib.file(list[0].file.path).dirName()
    }
  }
}

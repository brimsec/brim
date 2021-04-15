import {FileListData} from "./file-list"
import detectFileType from "./detect-file-type"

export default function(files: File[]): Promise<FileListData> {
  return Promise.all(
    files.map(async (file) => {
      const type = await detectFileType(file.path)
      return {type, file}
    })
  )
}

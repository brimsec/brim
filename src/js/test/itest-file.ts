import path from "path"
import fs from "fs"

export function itestFilePath(name: string) {
  return path.join(__dirname, "../../../itest/testdata", name)
}

export function itestFile(name) {
  const path = itestFilePath(name)
  const buffer = fs.readFileSync(path)
  const f = new File([buffer as BlobPart], name)
  f.path = path
  return f
}

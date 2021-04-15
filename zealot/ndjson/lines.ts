import {parse} from "./parse"
import {NEW_LINE, pipeJson} from "./pipe-json"
import {pipeText} from "./pipe-text"

export async function* eachLine(readable: ReadableStream<Uint8Array> | null) {
  for await (let json of pipeJson(pipeText(readable))) {
    yield json
  }
}

export function parseLines(string: string) {
  return string.split(NEW_LINE).map(parse)
}

import {parse} from "./parse"

export const NEW_LINE = "\n\n\n"

export async function* pipeJson(iterator: AsyncGenerator<string>) {
  let leftover = ""

  for await (let value of iterator) {
    let start = 0
    let end = 0
    let chunk = (leftover += value)

    while ((end = chunk.indexOf(NEW_LINE, start)) !== -1) {
      let line = chunk.substring(start, end)
      yield parse(line)
      start = end + NEW_LINE.length
    }
    leftover = chunk.substring(start)
  }

  if (leftover) yield parse(leftover)
}

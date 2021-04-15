export async function* pipeText(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) return
  let reader = stream.getReader()
  let text = new TextDecoder()
  try {
    while (true) {
      let {done, value} = await reader.read()
      if (!done && value) {
        yield text.decode(value)
      } else {
        return
      }
    }
  } finally {
    reader.releaseLock()
  }
}

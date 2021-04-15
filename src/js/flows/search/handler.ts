import {SearchResponse} from "./response"
import whenIdle from "../../lib/when-idle"

function abortError(e) {
  return /user aborted/i.test(e.message)
}

export function handle(request: any) {
  const response = new SearchResponse()
  const channels = new Map<number, any>()
  const promise = new Promise<void>((resolve, reject) => {
    function flushBuffer() {
      for (const [id, data] of channels) {
        response.emit(id, data.allRecords, data.schemas)
      }
      channels.clear()
    }

    const flushBufferLazy = whenIdle(flushBuffer)

    function errored(e) {
      flushBufferLazy.cancel()
      if (abortError(e)) {
        resolve()
      } else {
        response.emit("status", "ERROR")
        response.emit("error", e)
        reject(e)
      }
    }

    request
      .then((stream) => {
        stream
          .callbacks()
          .start(({task_id}) => {
            response.emit("start", task_id)
            response.emit("status", "FETCHING")
          })
          .records(({channel, allRecords, schemas}) => {
            channels.set(channel, {
              allRecords,
              schemas
            })
            flushBufferLazy()
          })
          .end(({id, error}) => {
            if (error) return errored(error)
            flushBuffer()
            response.emit("status", "SUCCESS")
            response.emit("end", id)
            setTimeout(resolve)
          })
          .warnings(({warning}) => response.emit("warnings", warning))
          .error(errored)
      })
      .catch(errored)
  })

  return {response, promise}
}

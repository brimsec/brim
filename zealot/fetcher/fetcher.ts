import {url} from "../util/utils"
import {parseContentType} from "./content-type"
import {Enhancer, ZealotPayload, ZReponse} from "../types"
import {createIterator} from "./iterator"
import {createStream} from "./stream"
import {createError} from "../util/error"
import {createPushableIterator} from "./pushable-iterator"
import {parseLines} from "../ndjson/lines"

export type FetchArgs = {
  path: string
  method: string
  body?: string | FormData
  headers?: Headers
  enhancers?: Enhancer[]
  signal?: AbortSignal
}

export function createFetcher(host: string) {
  return {
    async promise(args: FetchArgs) {
      const {path, method, body, signal, headers} = args
      const resp = await fetch(url(host, path), {method, body, signal, headers})
      const content = await parseContentType(resp)
      return resp.ok ? content : Promise.reject(createError(content))
    },
    async stream(args: FetchArgs): Promise<ZReponse> {
      const {path, method, body, signal, headers} = args
      const resp = await fetch(url(host, path), {method, body, signal, headers})
      if (!resp.ok) {
        const content = await parseContentType(resp)
        return Promise.reject(createError(content))
      }
      const iterator = createIterator(resp, args)
      return createStream(iterator, resp)
    },
    async upload(args: FetchArgs): Promise<ZReponse> {
      return new Promise((resolve) => {
        const iterator = createPushableIterator<ZealotPayload>()
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener("progress", (e) => {
          if (!e.lengthComputable) return
          iterator.push({
            value: {type: "UploadProgress", progress: e.loaded / e.total},
            done: false
          })
        })

        xhr.addEventListener("load", async () => {
          for (const value of parseLines(xhr.responseText))
            iterator.push({value, done: false})
        })

        xhr.addEventListener("error", () => {
          iterator.throw(new Error(xhr.responseText))
        })

        xhr.addEventListener("loadend", () => {
          iterator.push({done: true, value: undefined})
        })

        xhr.open(args.method, url(host, args.path), true)
        if (args.headers) {
          for (const [header, val] of args.headers.entries())
            xhr.setRequestHeader(header, val)
        }
        xhr.send(args.body)
        resolve(createStream(iterator, xhr))
      })
    }
  }
}

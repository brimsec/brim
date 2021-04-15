import {createZealot} from "./zealot"
import {FetchArgs} from "./fetcher/fetcher"
import {createStream} from "./fetcher/stream"
import {createError} from "./util/error"
import {Zealot, ZealotPayload} from "./types"
import {zngToZeek} from "./enhancers/mod"

type StubMode = "always" | "once"
type RespWrap = typeof stream | typeof promise

function fakeFetcher() {
  return {
    promise: ({method, path}: FetchArgs) => {
      throw new Error(`NoNetwork: You must stub: ${method} ${path}`)
    },
    stream: ({method, path}: FetchArgs) => {
      throw new Error(`NoNetwork: You must stub: ${method} ${path}`)
    },
    upload: ({method, path}: FetchArgs) => {
      throw new Error(`NoNetwork: You must stub: ${method} ${path}`)
    }
  }
}

function promise(response: any) {
  return Promise.resolve(response)
}

function stream(response: ZealotPayload[]) {
  const enhance = zngToZeek()
  async function* iterator() {
    if (response) {
      for (const payload of response) yield enhance(payload)
    }
  }

  return Promise.resolve(createStream(iterator(), {} as Response))
}

export interface ZealotMock {
  stubStream: (
    method: string,
    output: ZealotPayload[],
    mode?: StubMode
  ) => ZealotMock
  stubPromise: (method: string, output: any, mode?: StubMode) => ZealotMock
  stubError: (method: string, err: any, mode?: StubMode) => ZealotMock
  calls: (method: string) => {method: string; args: any}[]
  zealot: Zealot
}

export function createZealotMock(): ZealotMock {
  const calls: any[] = []
  const zealot = createZealot("unit.test", {fetcher: fakeFetcher})
  const outputs: {[m: string]: any[]} = {}

  function stub(method: string, out: any, wrap: RespWrap, mode: StubMode) {
    if (mode === "always") {
      override(method, () => wrap(out))
    } else {
      saveOnce(method, out)
      override(method, () => wrap(nextOut(method)))
    }
  }

  function override(method: string, func: any) {
    const fn = trackCalls(method, func)
    const [resource, action] = method.split(".")
    // @ts-ignore
    action ? (zealot[resource][action] = fn) : (zealot[resource] = fn)
  }

  function trackCalls(method: string, fn: any) {
    return (args: any) => {
      calls.push({method, args})
      return fn()
    }
  }

  function saveOnce(method: string, out: any) {
    outputs[method] = outputs[method] || []
    outputs[method].push(out)
  }

  function nextOut(method: string) {
    const next = outputs[method].shift()
    if (!next) throw new Error(`No remaining stubs for method: "${method}"`)
    return next
  }

  return {
    stubStream(method: string, output: any, mode: StubMode = "once") {
      stub(method, output, stream, mode)
      return this
    },
    stubPromise(method: string, output: any, mode: StubMode = "once") {
      stub(method, output, promise, mode)
      return this
    },
    stubError(method: string, err: any) {
      override(method, () => {
        throw createError(err)
      })
      return this
    },
    calls(method: string) {
      return calls.filter((c) => c.method === method)
    },
    zealot
  }
}

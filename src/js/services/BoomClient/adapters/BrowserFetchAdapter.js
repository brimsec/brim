/* @flow */

import BoomRequest from "../lib/BoomRequest"
import NdJsonDecoder from "../lib/NdJsonDecoder"

export function send(req: BoomRequest) {
  let {url, method, body, headers} = req
  let control = new AbortController()
  req.setAbort(() => control.abort())
  fetch(url, {method, body, headers, signal: control.signal})
    .then((resp) => {
      if (!resp.ok) {
        resp.text().then((text) => req.emitError(text))
      } else if (req.streaming) {
        const text = new TextDecoder()
        const ndJson = new NdJsonDecoder((payload) => req.emitStream(payload))
        const stream = resp.body && resp.body.getReader()

        const pull = () => {
          if (!stream) return

          stream
            .read()
            .then(({done, value}) => {
              if (!done && value) {
                ndJson.decode(text.decode(value))
                pull()
              } else if (done) {
                ndJson.flush()
                req.emitDone()
              }
            })
            .catch((error) => req.emitError(error))
        }
        pull()
      } else {
        resp.json().then((d) => req.emitDone(d))
      }
    })
    .catch((error) => req.emitError(error))

  return req
}

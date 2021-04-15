import https from "https"

import {retry} from "../lib/control"
import ZeekLogDescriptions from "ppl/zeek/descriptions"
import virusTotal from "../../src/js/services/virus-total"
import zeekLogInfo from "ppl/zeek/log-info"

test("ping virus total for a success", () => {
  const value = "80.239.217.49"
  const url = virusTotal.url(value)

  function makeRequest() {
    return new Promise((good, bad) => {
      https.get(url, (res) => {
        res.statusCode === 200 ? good() : bad()
      })
    })
  }

  return retry(makeRequest, 5)
})

describe("doc urls", () => {
  const stripSuffix = (s) => s.replace("_log", "")
  const buildUrl = (s) => [s, zeekLogInfo(s).docsUrl()]
  const request = (path, url) =>
    new Promise((good, bad) => {
      https
        .request(url, {method: "HEAD"}, (res) => {
          if (res.statusCode === 200) good()
          else bad(`${res.statusCode}: ${path}${url}`)
        })
        .end()
    })

  Object.keys(ZeekLogDescriptions)
    .map(stripSuffix)
    .map(buildUrl)
    .forEach(([path, url]) => {
      test(`doc url responds 200 for ${path}`, () =>
        retry(() => request(path, url), 5))
    })
})

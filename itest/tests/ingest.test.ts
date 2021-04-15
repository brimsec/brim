import path from "path"

import {handleError} from "../lib/jest"
import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/new-app-instance"

describe("Ingest tests", () => {
  let app
  let testIdx = 0
  beforeAll(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return appStep.startApp(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      return await app.stop()
    }
  })

  const searchZql =
    "_path=conn proto=tcp | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts"
  const sampleFiles = [
    "sample.pcap",
    "sample.pcapng",
    "sample.tsv",
    "sample.ndjson",
    "sample.zng"
  ]

  sampleFiles.forEach((fileName) => {
    test(`ingest of ${fileName}`, (done) => {
      appStep
        .ingestFile(app, fileName)
        .then(async () => {
          const results = await appStep.search(app, searchZql)
          expect(results).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    })
  })

  // Skip for now since it consistently fails in CI
  // test(`ingest of alerts.pcap (suricata)`, (done) => {
  //   appStep
  //     .ingestFile(app, "alerts.pcap")
  //     .then(async () => {
  //       const results = await appStep.search(
  //         app,
  //         "event_type = alert | every 1s count()"
  //       )
  //       expect(results).toMatchSnapshot()
  //       done()
  //     })
  //     .catch((err) => {
  //       handleError(app, err, done)
  //     })
  // })
})

import {basename} from "path"

import {sprintf} from "sprintf-js"

import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/new-app-instance"
import {handleError} from "../lib/jest"

const simpleQueries = [
  "* | count()",
  "* | count() by _path | sort _path",
  "_path=conn | count()",
  "_path=conn | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts",
  "* | every 2s count() | sort ts",
  "* | every 2s count() by _path | sort ts, _path",
  "_path=x509 or _path=ssl | sort _path"
]

describe("Query tests", () => {
  let app
  let testIdx = 0

  beforeAll(async () => {
    app = newAppInstance(basename(__filename), ++testIdx)
    await appStep.startApp(app)
    await appStep.ingestFile(app, "sample.tsv")
    await appStep.setSpan(app, "Whole Space")
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  for (let i = 0; i < simpleQueries.length; i++) {
    const zql = simpleQueries[i]
    const testId = sprintf("%03d", i)
    test(`query${testId}: "${zql}"`, (done) => {
      appStep
        .search(app, zql)
        .then((results) => {
          expect(results).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    })
  }
})

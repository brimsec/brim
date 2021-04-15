import {basename} from "path"
import {sprintf} from "sprintf-js"

import {getResults, runSearch} from "../lib/appStep/api/search"
import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/new-app-instance"
import {handleError} from "../lib/jest"
import {selectors} from "../../src/js/test/integration"

// Fields we can test in types.tsv
const FIELDS = ["scalar", "record.scalar"]
// Brim character that represents an unset zng value. It must be
// handled specially as it can be a string value or the unset
// representation. That representation is only used to find a cell, or
// to exclude the actual character from search results.
const UNSET = "⦻"
const STRINGS = [
  "mystr",
  "\\x2d",
  "\\x09",
  '"',
  "'",
  ",",
  ";",
  "∫£œßü™",
  '"mystr"',
  "'mystr'",
  "*",
  '"*"',
  "1.1.1.1",
  " ",
  "null",
  "⦻" // The actual character, not unset.
]
const ADDRS = ["1.1.1.1", "fe80::58d2:2d09:e8cb:a8ad", "::"]

describe("type-wise Filter = value searches", () => {
  let app

  beforeAll(async (done) => {
    app = newAppInstance(basename(__filename) + "-types", 0)
    await appStep.startApp(app)
    await appStep.ingestFile(app, "types.tsv")
    await appStep.setSpan(app, "Whole Space")
    done()
  })

  afterAll(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  test("FilterEq ensure ingest", (done) => {
    appStep
      .search(app, `* | count() by _path | sort _path`)
      .then((results) => {
        expect(results).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  const run = (path: string, values: string[]) => {
    let testIdx = 0
    FIELDS.forEach((fieldName) => {
      values.forEach((s) => {
        const testId = sprintf("%04d", testIdx++)
        test(`FilterEq${testId}: ${path} ${fieldName}="${s}"`, (done) => {
          runSearch(
            app,
            `_path=${path} ${fieldName}!=null | cut id, ${fieldName} | sort id`
          )
            .then(async () => {
              await appStep.rightClick(
                app,
                selectors.viewer.resultCellContaining(s)
              )
              await appStep.click(
                app,
                selectors.viewer.contextMenuItem("Filter = value")
              )
              expect(await getResults(app)).toMatchSnapshot()
              done()
            })
            .catch((err) => {
              handleError(app, err, done)
            })
        })
      })
    })
  }
  run("string", STRINGS)

  test(`FilterEq unset/${UNSET} string`, (done) => {
    runSearch(app, `_path=string | cut id, scalar | sort -r id | head 10`)
      .then(async () => {
        await appStep.rightClick(
          app,
          selectors.viewer.resultCellContaining(UNSET)
        )
        await appStep.click(
          app,
          selectors.viewer.contextMenuItem("Filter = value")
        )
        expect(await getResults(app)).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  run("addr", ADDRS)
})

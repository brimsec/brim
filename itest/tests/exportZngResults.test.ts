import fsExtra from "fs-extra"

import os from "os"
import path from "path"

import {stdTest} from "../lib/jest"
import {
  defaultModalButton,
  toastLocator,
  toolbarExportButton
} from "../../src/js/test/locators"
import createTestBrim from "../lib/createTestBrim"

const filePath = path.join(os.tmpdir(), "results.zng")

describe("exporting tests", () => {
  const brim = createTestBrim("exportZngResults")

  beforeAll(() => brim.ingest("sample.tsv"))

  stdTest("clicking the export button", async (done) => {
    await brim.mockSaveDialog({canceled: false, filePath})
    await brim.search("")
    await brim.click(toolbarExportButton)
    await brim.click(defaultModalButton)
    await brim.waitForHTMLText(toastLocator.css, /export complete/i)

    expect(fsExtra.statSync(filePath).size).toBeGreaterThan(0)
    await fsExtra.remove(filePath)
    done()
  })

  stdTest("canceling the export", async (done) => {
    await brim.mockSaveDialog({canceled: true, filePath: undefined})
    await brim.click(toolbarExportButton)
    await brim.click(defaultModalButton)
    await brim.wait(1)

    expect(await fsExtra.pathExists(filePath)).toBe(false)
    done()
  })
})

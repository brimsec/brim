import {readFileSync, readdirSync, unlinkSync} from "fs"
import md5 from "md5"
import path from "path"

import {LOG} from "../lib/log"
import appStep from "../lib/appStep/api"
import {pcapsDir} from "../lib/appStep/api/save-pcap"
import {runSearch} from "../lib/appStep/api/search"
import newAppInstance from "../lib/new-app-instance"
import {selectors} from "../../src/js/test/integration"
import {handleError} from "../lib/jest"

const clearPcaps = async (app) => {
  const dir = await pcapsDir(app)
  const files = readdirSync(dir)
  files.forEach((fileBasename) => {
    if (fileBasename.match(/^packets-.+\.pcap$/)) {
      const fileAbspath = path.join(dir, fileBasename)
      unlinkSync(fileAbspath)
      LOG.debug(`Unlinked file ${fileAbspath}`)
    }
  })
}

describe("Test PCAPs", () => {
  let app
  let testIdx = 0

  beforeEach(async () => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    await appStep.startApp(app)
    await clearPcaps(app)
    return appStep.ingestFile(app, "sample.pcap")
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  test("pcap button downloads deterministically-formed pcap file", (done) => {
    runSearch(
      app,
      "_path=ssl id.orig_h=192.168.1.110 id.resp_h=209.216.230.240 id.resp_p=443"
    )
      .then(async () => {
        await appStep.click(app, selectors.viewer.resultCellContaining("ssl"))
        const downloadText = await appStep.savePcap(app)
        expect(downloadText).toBe("Download Complete")
        const fileBasename = "packets-1582646593.996366.pcap"
        const pcapAbspath = path.join(await pcapsDir(app), fileBasename)
        expect(md5(readFileSync(pcapAbspath))).toBe(
          "888453c81738fd8ade4c7f9888d86f86"
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  test("pcap download works for null duration", (done) => {
    runSearch(app, "duration=null id.orig_p=47783")
      .then(async () => {
        await appStep.click(app, selectors.viewer.resultCellContaining("conn"))
        const downloadText = await appStep.savePcap(app)
        expect(downloadText).toBe("Download Complete")
        const fileBasename = "packets-1582646589.440467.pcap"
        const pcapAbspath = path.join(await pcapsDir(app), fileBasename)
        expect(md5(readFileSync(pcapAbspath))).toBe(
          "678442857027fdc5ad1e3418614dcdb8"
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})

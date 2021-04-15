import {Application} from "spectron"
import path from "path"

import {testDataDir} from "../../env"
import {click} from "./click"
import logStep from "../util/log-step"
import {selectors} from "../../../../src/js/test/integration"
import waitForHook from "./wait-for-hook"

export default async (app: Application, file: string) => {
  // Ingest a file inside the itest/testdata directory
  await click(app, ".add-tab")

  await logStep("wait for pcap file input", async () =>
    (await app.client.$(selectors.ingest.filesButton)).waitForDisplayed()
  )

  await logStep("choose file", async () => {
    const fileInput = await app.client.$(selectors.ingest.filesInput)
    const remoteFile = await app.client.uploadFile(
      path.normalize(path.join(testDataDir(), file))
    )
    await fileInput.addValue(remoteFile)
  })

  await waitForHook(app, "import-complete", {
    timeout: 120 * 1000, // Give an import up to 2 minutes to complete (slow CI servers)
    timeoutMsg: `The import-complete hook never appeared during import of: ${file}`
  })
}

import {Application} from "spectron"

import logStep from "../util/log-step"
import {selectors} from "../../../../src/js/test/integration"

export const waitForNewTab = (app: Application) =>
  logStep("wait for new tab to appear", async () =>
    (await app.client.$(selectors.ingest.filesButton)).waitForDisplayed()
  )

export default async (app: Application) => {
  await logStep("starting app", () => app.start())
  return waitForNewTab(app)
}

import {Application} from "spectron"

import logStep from "./log-step"
import {selectors} from "../../../../src/js/test/integration"

export default (app: Application) =>
  logStep("wait for results viewer to appear", async () =>
    (await app.client.$(selectors.viewer.results_base)).waitForDisplayed()
  )

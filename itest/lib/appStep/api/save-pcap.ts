import {Application} from "spectron"

import {retryUntil} from "../../control"
import {waitForClickableButtonAndClick} from "./click"
import logStep from "../util/log-step"
import {selectors} from "../../../../src/js/test/integration"

export default async (app: Application) => {
  await waitForClickableButtonAndClick(app, selectors.pcaps.button)
  return logStep("wait for a download to finish", async () => {
    await (await app.client.$(selectors.downloadMessage)).waitForDisplayed()
    return retryUntil(
      async () => (await app.client.$(selectors.downloadMessage)).getText(),
      (text) => text == "Download Complete" || text.includes("Download error")
    )
  })
}

export const pcapsDir = (app: Application) =>
  app.electron.remote.app.getPath("temp")

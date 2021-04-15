import {Application} from "spectron"

import logStep from "../util/log-step"
import {retry} from "../../control"

export default (app: Application) =>
  // Issue a browser window reload(). This is flaky in the Spectron,
  // Chromedriver stack, but appears be contained within the method.
  // It seems safe to retry.
  // https://github.com/brimdata/brim/issues/878
  // https://github.com/electron-userland/spectron/issues/493
  logStep("app reload", () => retry(() => app.browserWindow.reload(), 60, 1000))

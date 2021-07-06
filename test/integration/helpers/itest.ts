import {Application} from "spectron"
import startApp from "./appStep/api/startApp"
import BrimDriver from "./brim-driver"
import BrimSelectors, {InitializedBrimSelectors} from "./brim-selectors"
import newAppInstance from "./newAppInstance"

export default function itest(
  name: string
): [BrimDriver, InitializedBrimSelectors] {
  let app: Application
  let testIdx = 0
  let brim = new BrimDriver(app)
  let $ = new BrimSelectors() as unknown

  beforeAll(async () => {
    app = newAppInstance(name, ++testIdx)
    await startApp(app)
    brim.init(app)
    ;($ as BrimSelectors).init(app.client)
  })

  afterAll(async () => {
    if (app && app.isRunning()) await app.stop()
  })

  return [brim, $ as InitializedBrimSelectors]
}

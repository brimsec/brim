import {setupBrowser, WebdriverIOQueries} from "@testing-library/webdriverio"
import {Application} from "spectron"
import lib from "src/js/lib"
import ingestFile from "./appStep/api/ingestFile"
import search, {getResults} from "./appStep/api/search"
import takeScreenshot from "./appStep/api/takeScreenshot"
import waitForHook from "./appStep/api/waitForHook"
import logStep from "./appStep/util/logStep"
import {retryUntil} from "./control"
import {Locator} from "./createLocator"
import {htmlContextMenu} from "./locators"
export default class BrimDriver {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  init(app): this is BrimDriver & WebdriverIOQueries {
    this.app = app
    const queries = setupBrowser(app.client)
    Object.assign(this, queries)
    return true
  }

  hook(name, opts?) {
    return waitForHook(this.app, name, opts)
  }

  navTo(path: string) {
    // @ts-ignore
    return this.app.client.execute((path) => navTo(path), path)
  }

  ingest(file: string) {
    return ingestFile(this.app, file)
  }

  mockSaveDialog(value: {
    canceled: boolean
    filePath: string | null | undefined
  }) {
    return this.app.mainProcess.emit(
      // @ts-ignore
      "spectron:mock",
      "windows:showSaveDialog",
      value
    )
  }

  setValue(locator: Locator, value: string) {
    return logStep(`set input ${locator.css} to ${value}`, async () => {
      const el = await this.app.client.$(locator.css)
      await el.waitForDisplayed()
      return el.setValue(value)
    })
  }

  takeScreenshot() {
    return takeScreenshot(this.app)
  }

  clickAppMenuItem(id: string) {
    // @ts-ignore
    return this.app.mainProcess.emit("spectron:clickAppMenuItem", id)
  }

  async clickContextMenuItem(text: string) {
    const menu = await this.app.client.$(htmlContextMenu)
    const item = await menu.$(`li=${text}`)
    return item.click()
  }

  search(input: string) {
    return search(this.app, input)
  }

  click(locator: WebdriverIO.Element) {
    return locator.click({button: "left"})
  }

  rightClick(locator: WebdriverIO.Element) {
    return locator.click({button: "right"})
  }

  hasText(input: string | RegExp, locator: Locator | string = "body") {
    return retryUntil(
      () =>
        this.app.client
          .$(typeof locator === "string" ? locator : locator.css)
          .then((el) => el.getText()),
      (s) => (typeof input === "string" ? s.includes(input) : input.test(s))
    )
  }

  // waitForHTMLText will seek out html instead of visible text, use for hidden elements
  waitForHTMLText(locator: string, regex: RegExp) {
    return retryUntil(
      async () => (await this.app.client.$(locator)).getHTML(false),
      (s) => regex.test(s)
    )
  }

  async isVisible(locator: Locator) {
    return !!(await (await this.app.client.$(locator.css)).isDisplayed())
  }

  async isNotVisible(locator: Locator) {
    return !(await (await this.app.client.$(locator.css)).isDisplayed())
  }

  wait(ms: number) {
    return lib.sleep(ms)
  }

  viewerResults(opts: {headers: boolean} = {headers: true}) {
    return getResults(this.app, opts.headers)
  }
}

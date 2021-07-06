import {
  BrowserBase,
  setupBrowser,
  WebdriverIOBoundFunctions
} from "@testing-library/webdriverio"
import {queries} from "@testing-library/dom/types"

export type InitializedBrimSelectors = BrimSelectors &
  WebdriverIOBoundFunctions<typeof queries>
export default class BrimSelectors {
  init(browser: BrowserBase): this is InitializedBrimSelectors {
    Object.assign(this, setupBrowser(browser))
    return true
  }
}

import Histories from "app/core/models/histories"
import {FeatureName} from "../state/Feature"
import {BrowserHistory} from "history"
import {WebdriverIOQueries} from "@testing-library/webdriverio"

declare global {
  namespace NodeJS {
    interface Global {
      fetch: any
      DOMRectReadOnly: any
      ResizeObserver: any
      SVGElement: any
      windowId: string
      windowName: "search" | "detail" | "about" | "hidden"
      getState: () => any
      feature: (name: FeatureName, value: boolean) => void
      tabHistories: Histories
      windowHistory: BrowserHistory
      navTo: (path: string) => void
    }

    interface Process {
      on(event: "spectron:mock", listener: MessageListener): this

      on(event: "spectron:clickAppMenuItem", listener: MessageListener): this
    }
  }

  // https://testing-library.com/docs/webdriverio-testing-library/intro/#typescript
  namespace WebdriverIO {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Browser extends WebdriverIOQueries {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Element extends WebdriverIOQueries {}
  }
}

export default global

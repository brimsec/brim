import {appPathSetup} from "./app-path-setup"
import userTasks from "./user-tasks"

// app path and log setup should happen before other imports.
appPathSetup()

import {app} from "electron"
import log from "electron-log"
import "regenerator-runtime/runtime"
import {setupAutoUpdater} from "./auto-updater"
import {Brim} from "./brim"
import globalStoreMainHandler from "./ipc/globalStore/main-handler"
import windowsMainHandler from "./ipc/windows/main-handler"
import secretsMainHandler from "./ipc/secrets/main-handler"
import electronIsDev from "./is-dev"
import menu from "./menu"
import {handleQuit} from "./quitter"

import {handleSquirrelEvent} from "./squirrel"

console.time("init")

async function main() {
  if (handleSquirrelEvent(app)) return
  userTasks(app)
  const brim = await Brim.boot()
  menu.setMenu(brim)

  windowsMainHandler(brim)
  globalStoreMainHandler(brim)
  secretsMainHandler()

  handleQuit(brim)

  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!electronIsDev) {
    setupAutoUpdater().catch((err) => {
      log.error("Failed to initiate autoUpdater: " + err)
    })
  }

  const brimCustomProtocol = "brim"
  app.setAsDefaultProtocolClient(brimCustomProtocol)
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      // handle custom protocol url handling for windows here
      if (arg.startsWith(`${brimCustomProtocol}://`)) return brim.openUrl(arg)

      switch (arg) {
        case "--new-window":
          brim.windows.openWindow("search")
          break
        case "--move-to-current-display":
          brim.windows.moveToCurrentDisplay()
          break
      }
    }
  })

  app.whenReady().then(() => brim.start())
  app.on("activate", () => brim.activate())

  app.on("open-url", (event, url) => {
    // recommended to preventDefault in docs: https://www.electronjs.org/docs/api/app#event-open-url-macos
    event.preventDefault()
    brim.openUrl(url)
  })

  app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (e) => {
      e.preventDefault()
      log.error("Security Warning: Prevented creation of webview")
    })

    contents.on("will-navigate", (e, url) => {
      if (contents.getURL() === url) return // Allow reloads
      e.preventDefault()
      log.error(`Security Warning: Prevented navigation to ${url}`)
    })

    contents.on("new-window", (e) => {
      e.preventDefault()
      log.error("Security Warning: Prevented new window from renderer")
    })
  })
}

app.disableHardwareAcceleration()
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  main().then(() => {
    if (process.env.BRIM_ITEST === "true") require("./itest")
  })
} else {
  app.quit()
}

import {appPathSetup} from "./appPathSetup"
import userTasks from "./userTasks"
import * as auth from "../auth"

// app path and log setup should happen before other imports.
appPathSetup()

import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import menu from "./menu"
import windowsMainHandler from "./ipc/windows/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {app} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import electronIsDev from "./isDev"
import {setupAutoUpdater} from "./autoUpdater"
import log from "electron-log"
import {handleQuit} from "./quitter"
import {Brim} from "./brim"

async function main() {
  if (handleSquirrelEvent(app)) return
  userTasks(app)
  const brim = await Brim.boot()
  menu.setMenu(brim)
  windowsMainHandler(brim)
  globalStoreMainHandler(brim)
  handleQuit(brim)

  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!electronIsDev) {
    setupAutoUpdater().catch((err) => {
      log.error("Failed to initiate autoUpdater: " + err)
    })
  }

  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
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

  app.setAsDefaultProtocolClient("brim")
  app.on("open-url", (event, url) => {
    // event.preventDefault()
    // handle the data
    auth
      .loadTokens(url)
      .then(() => {
        log.info("logged in!")
        brim.start()
      })
      .catch((e) => log.error("error loading tokens: ", e))
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

import {app} from "electron"
import keytar from "keytar"
import url from "url"
import os from "os"
import path from "path"
import {ZQD} from "ppl/zqd/zqd"
import {Store} from "redux"
import {
  deserializeState,
  toAccessTokenKey,
  toRefreshTokenKey
} from "../auth0/utils"
import createGlobalStore from "../state/create-global-store"
import {getGlobalPersistable} from "../state/get-persistable"
import Prefs from "../state/Prefs"
import Workspaces from "../state/Workspaces"
import {installExtensions} from "./extensions"
import ipc from "./ipc"
import sendTo from "./ipc/send-to"
import isDev from "./is-dev"
import tron, {Session} from "./tron"
import formatSessionState from "./tron/format-session-state"
import {sessionStateFile} from "./tron/session"
import windowManager, {$WindowManager} from "./tron/window-manager"

type QuitOpts = {
  saveSession?: boolean
}

type BrimArgs = {
  windows?: $WindowManager
  store?: Store
  session?: Session
  zqd?: ZQD
}

export class Brim {
  readonly windows: $WindowManager
  readonly store: Store
  readonly zqd: ZQD
  readonly session: Session
  public isQuitting = false

  static async boot(
    sessionPath: string = sessionStateFile(),
    createSession = tron.session
  ) {
    const session = createSession(sessionPath)
    const data = await session.load()
    const windows = windowManager(data)
    const store = createGlobalStore(data?.globalState)
    const select = (fn) => fn(store.getState())
    const suricataRunner = select(Prefs.getSuricataRunner)
    const suricataUpdater = select(Prefs.getSuricataUpdater)
    const zeekRunner = select(Prefs.getZeekRunner)
    const spaceDir = path.join(app.getPath("userData"), "data", "spaces")
    const zqd = new ZQD(spaceDir, suricataRunner, suricataUpdater, zeekRunner)
    return new Brim({session, windows, store, zqd})
  }

  constructor(args: BrimArgs = {}) {
    this.windows = args.windows || windowManager()
    this.store = args.store || createGlobalStore(undefined)
    this.session = args.session || tron.session()
    this.zqd = args.zqd || new ZQD(null, null, null, null)
  }

  async start() {
    this.zqd.start()
    if (this.isDev()) await installExtensions()
    this.windows.init()
  }

  activate() {
    if (this.windows.count() === 0) this.windows.init()
  }

  async resetState() {
    // clear keys from secrets storage
    Workspaces.all(this.store.getState()).forEach((ws) => {
      if (ws.authType !== "auth0") return
      keytar.deletePassword(toRefreshTokenKey(ws.id), os.userInfo().username)
      keytar.deletePassword(toAccessTokenKey(ws.id), os.userInfo().username)
    })
    await this.session.delete()
    app.relaunch()
    this.quit({saveSession: false})
  }

  async saveSession() {
    const windowState = await this.windows.serialize()
    const mainState = getGlobalPersistable(this.store.getState())

    await this.session.save(formatSessionState(windowState, mainState))
  }

  async deleteSession() {
    await this.session.delete()
  }

  async quit(opts: QuitOpts = {saveSession: true}) {
    this.isQuitting = true
    if (await this.windows.confirmQuit()) {
      await this.windows.prepareQuit()
      if (opts.saveSession) {
        await this.saveSession()
      }
      this.windows.quit()
      await this.zqd.close()
      app.quit()
    } else {
      this.isQuitting = false
    }
  }

  openUrl(uri) {
    const urlParts = url.parse(uri, true)
    const code = urlParts.query.code as string
    const state = urlParts.query.state as string
    const {workspaceId, windowId} = deserializeState(state)
    const win = this.windows.getWindow(windowId)

    win.ref.focus()

    sendTo(win.ref.webContents, ipc.windows.authCallback(workspaceId, code))
  }

  isDev() {
    return isDev
  }
}

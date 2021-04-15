import {BrowserWindow, screen} from "electron"
import {last} from "lodash"
import brim from "../../brim"
import ipc from "../ipc"
import sendTo from "../ipc/send-to"
import {NewTabSearchParams} from "../ipc/windows/messages"
import {dimensFromSizePosition, stack} from "../window/dimens"
import {SearchWindow} from "../window/search-window"
import tron from "./"
import {SessionState} from "./format-session-state"
import {WindowParams} from "./window"
import log from "electron-log"

export type WindowName = "search" | "about" | "detail"
export type $WindowManager = ReturnType<typeof windowManager>

export type WindowsState = {
  [key: string]: BrimWindow
}

export interface SerializedWindow {
  id: string
  name: WindowName
  position: [number, number]
  size: [number, number]
  lastFocused: number
  state: any
}

export interface BrimWindow {
  ref: BrowserWindow
  name: WindowName
  id: string
  lastFocused: number
  initialState: any
  serialize: () => Promise<SerializedWindow>
  confirmClose: () => Promise<boolean>
  prepareClose: () => Promise<void>
  close: () => void
}

export default function windowManager(
  session?: SessionState | null | undefined
) {
  let windows: WindowsState = {}

  return {
    init() {
      if (!session || (session && session.order.length === 0)) {
        this.openWindow("search")
      } else {
        for (const id of session.order) {
          const {name, size, position, state} = session.windows[id]
          this.openWindow(name, {size, position, id}, state)
        }
      }
    },

    whenAllClosed() {
      return new Promise((resolve) => {
        const checkCount = () => {
          if (this.count() === 0) resolve()
          else setTimeout(checkCount, 0)
        }
        checkCount()
      })
    },

    serialize(): Promise<SerializedWindow[]> {
      return Promise.all(
        this.getWindows()
          .filter((w) => w.name === "search")
          .map((w: BrimWindow) => w.serialize())
      )
    },

    confirmQuit(): Promise<boolean> {
      return Promise.all<boolean[]>(
        this.getWindows().map((w: BrimWindow) => w.confirmClose())
      )
        .then((oks) => oks.every((ok) => ok))
        .catch((e) => {
          log.error(e)
          return true
        })
    },

    prepareQuit(): Promise<void[]> {
      return Promise.all(
        this.getWindows().map((w: BrimWindow) => w.prepareClose())
      )
    },

    quit() {
      this.getWindows().forEach((w: BrimWindow) => w.close())
    },

    getWindows(): BrimWindow[] {
      return Object.values(windows).sort(
        (a, b) => a.lastFocused - b.lastFocused
      )
    },

    count(): number {
      return Object.keys(windows).length
    },

    getWindow(id: string): BrimWindow {
      return windows[id]
    },

    openSearchTab(searchParams: NewTabSearchParams) {
      let isNewWin = true
      const existingWin = this.getWindows()
        .sort((a, b) => b.lastFocused - a.lastFocused)
        .find((w) => w.name === "search")
      if (existingWin) {
        isNewWin = false
        sendTo(
          existingWin.ref.webContents,
          ipc.windows.newSearchTab({...searchParams, isNewWin})
        )
        existingWin.ref.focus()
        return
      }

      const {href} = searchParams
      const win = this.openWindow("search", {query: {href}})
      win.ref.webContents.once("did-finish-load", () => {
        sendTo(
          win.ref.webContents,
          ipc.windows.newSearchTab({...searchParams, isNewWin})
        )
      })
    },

    openWindow(
      name: WindowName,
      winParams: Partial<WindowParams> = {},
      initialState: any = undefined
    ): BrimWindow {
      const lastWin = last<BrimWindow>(
        this.getWindows().filter((w) => w.name === name)
      )
      const params = defaultWindowParams(winParams, lastWin && lastWin.ref)
      const id = params.id

      if (name === "search") {
        const {size, position, query, id} = params
        const dimens = dimensFromSizePosition(size, position)
        const win = new SearchWindow(dimens, query, initialState, id)
        windows[id] = win
        win.ref.on("closed", () => {
          delete windows[id]
        })
        return win
      } else {
        const ref = tron
          .window(name, params)
          .on("focus", () => {
            windows[id].lastFocused = new Date().getTime()
          })
          .on("closed", () => {
            delete windows[id]
          })

        const win = {
          id,
          ref,
          name,
          lastFocused: new Date().getTime(),
          initialState,
          close: () => Promise.resolve(),
          async confirmClose() {
            return true
          },
          async prepareClose() {},
          async serialize() {
            return {
              id,
              name,
              lastFocused: this.lastFocused,
              state: "Fill this in later",
              position: ref.getPosition() as [number, number],
              size: ref.getSize() as [number, number]
            }
          }
        }
        windows[id] = win
        return win
      }
    },

    openAbout() {
      const about = this.getWindows().find((w) => w.name === "about")
      if (about) {
        about.ref.focus()
      } else {
        this.openWindow("about")
      }
    },

    openPreferences() {
      const win = this.getWindows()
        .sort((a, b) => (b.lastFocused || 0) - (a.lastFocused || 0))
        .find((w) => w.name === "search")

      if (win) {
        win.ref.webContents.send("showPreferences")
      } else {
        const newWin = this.openWindow("search", {})

        newWin.ref.webContents.once("did-finish-load", () => {
          newWin.ref.webContents.send("showPreferences")
        })
      }
    },

    closeWindow() {
      const win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    },

    moveToCurrentDisplay() {
      const point = screen.getCursorScreenPoint()
      const bounds = screen.getDisplayNearestPoint(point).workArea
      const {x, y} = bounds

      let prev = [x, y]
      this.getWindows().forEach(({ref: win}: BrimWindow) => {
        const [width, height] = win.getSize()
        const [x, y] = prev
        const next = stack({x, y, width, height}, bounds, 25)
        win.setBounds(next)
        prev = [next.x, next.y]
      })
    }
  }
}

function defaultWindowParams(
  params: Partial<WindowParams>,
  lastWin?: BrowserWindow
): WindowParams {
  let {position, size} = params
  if (lastWin && !position && !size) {
    const prev = lastWin.getBounds()
    const bounds = screen.getDisplayNearestPoint({x: prev.x, y: prev.y})
    const dimens = stack(prev, bounds.workArea, 25)
    position = [dimens.x, dimens.y]
    size = [dimens.width, dimens.height]
  }

  return {
    size,
    position,
    id: brim.randomHash(),
    query: {},
    ...params
  }
}

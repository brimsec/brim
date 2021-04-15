import {BrowserWindow} from "electron"

import {WindowName} from "./window-manager"

export type WindowParams = {
  size: [number, number]
  position?: [number, number]
  query: Object
  id: string
}

export default function window(name: WindowName, params: WindowParams) {
  switch (name) {
    case "about":
      return aboutWindow()
    case "detail":
      return detailWindow(params)
    default:
      throw new Error(`Unknown window name: ${name}`)
  }
}

function aboutWindow() {
  const win = new BrowserWindow({
    resizable: false,
    minimizable: false,
    maximizable: false,
    width: 360,
    height: 360,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  win.setMenu(null)
  win.center()
  win.loadFile("about.html")
  return win
}

function detailWindow(params) {
  const {size, position, query, id} = params
  const win = new BrowserWindow({
    resizable: true,
    width: 360,
    height: 360,
    minWidth: 500,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  if (size) {
    win.setSize(size[0], size[1])
  }
  if (position) {
    win.setPosition(position[0], position[1])
  } else {
    win.center()
  }

  win.loadFile("detail.html", {query: {...query, id}})

  return win
}

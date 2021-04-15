import {BrowserWindow, Menu, MenuItemConstructorOptions} from "electron"
import {Brim} from "../brim"

import actions from "./actions"
import appMenu from "./app-menu"

export type $MenuItem = MenuItemConstructorOptions
export type $Menu = $MenuItem[]

function setMenu(brim: Brim) {
  function send(channel, ...args) {
    let win = BrowserWindow.getFocusedWindow()
    if (win && win.webContents) win.webContents.send(channel, ...args)
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(send, brim)))
}

export default {
  setMenu,
  actions,
  separator: (): MenuItemConstructorOptions => ({type: "separator"})
}

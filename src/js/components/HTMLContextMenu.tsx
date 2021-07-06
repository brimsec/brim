/* 
  This is a component only used for integration tests. Since spectron cannot
  interact with the native right click menus, this component creates an
  html version of the right click menus with the same labels and click handlers
  that the native menu will recieve.

  Usually, when a native menu is clicked, it sends an event to the originating
  renderer process. This component simulates that simply by emiting the event
  here in the renderer. See the stubIpcSend() function below.
*/

import React, {useState} from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import {ipcRenderer} from "electron"

import lib from "../lib"
import useEventListener from "./hooks/useEventListener"

import {reactElementProps} from "../../../test/integration/helpers/integration"

export default function HTMLContextMenu() {
  const [template, setTemplate] = useState(null)
  const openMenu = (e) => setTemplate(e.detail)

  useEventListener(document, "nativeContextMenu", openMenu, [])

  if (!template) return null
  return ReactDOM.createPortal(
    <div
      className="html-context-menu"
      {...reactElementProps("contextMenu")}
      onClick={() => setTemplate(null)}
    >
      <ul>
        {template.map((item, i) => (
          <HTMLMenuItem item={item} key={i} />
        ))}
      </ul>
    </div>,
    lib.doc.id("tooltip-root")
  )
}

function HTMLMenuItem({item}) {
  if (item.type === "separator") {
    return <hr />
  } else {
    return (
      <li
        onClick={() => item.click(item, stubbedBrowserWindow)}
        className={classNames({disabled: item.enabled === false})}
      >
        {item.label}
      </li>
    )
  }
}

function stubIpcSend(name, ...args) {
  if (process.env.BRIM_ITEST === "true") {
    /*
    This is for integration tests when we are testing the real ipc communication

    Since ipcRendere inherits from EventEmitter, we can simply emit this event
    right here in the renderer to simulate it being sent over from the main
    processes like it does with the native context menu.
  */
    ipcRenderer.emit(
      name,
      null,
      /* event */
      ...args
    )
  } else {
    // This is for unit tests when the ipcRenderer is mocked
    // @ts-ignore
    ipcRenderer.emitter.emit("receive-from-main", name, ...args)
  }
}

const stubbedBrowserWindow = {webContents: {send: stubIpcSend}}

import {ipcMain} from "electron"
import ipc from ".."
import sendTo from "../send-to"
import {Brim} from "../../brim"

export default function(brim: Brim) {
  ipcMain.handle("globalStore:init", () => {
    return {
      initialState: brim.store.getState()
    }
  })

  ipcMain.handle("globalStore:dispatch", (e, {action}) => {
    brim.store.dispatch(action)
    for (const win of brim.windows.getWindows()) {
      // Don't send it back to the sender, their store will have already been updated.
      if (!win.ref.isDestroyed() && e.sender !== win.ref.webContents) {
        sendTo(
          win.ref.webContents,
          // Adding remote: true to prevent infinite loops
          ipc.globalStore.dispatch({...action, remote: true})
        )
      }
    }
  })
}

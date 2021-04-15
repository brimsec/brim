import {useEffect} from "react"

import {ipcRenderer, IpcRendererEvent} from "electron"

export default function useIpcListener(
  channel: string,
  func: (event: IpcRendererEvent, ...args: any[]) => void,
  deps?: any[]
) {
  useEffect(() => {
    ipcRenderer.on(channel, func)
    return () => ipcRenderer.removeListener(channel, func)
  }, deps)
}

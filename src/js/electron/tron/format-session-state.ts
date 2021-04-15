import {GlobalState} from "../../state/global-reducer"
import {SerializedWindow} from "./window-manager"

export type SessionState = {
  order: string[]
  windows: {
    [id: string]: {
      name: string
      position: [number, number]
      size: [number, number]
      state: Object
    }
  }
  globalState: GlobalState
}

export default function(
  windows: SerializedWindow[],
  globalState: GlobalState
): SessionState {
  const groupById = (all, window) => ({
    ...all,
    [window.id]: getWindowData(window)
  })

  const order = getWindowOrder(windows)

  return {
    order,
    windows: windows.reduce(groupById, {}),
    globalState
  }
}

function getWindowOrder(windows: SerializedWindow[]): string[] {
  return windows.map((e) => e.id)
}

function getWindowData({name, state, size, position}: SerializedWindow) {
  return {name, state, size, position}
}

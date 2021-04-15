import {State} from "../../../state/types"
import {WindowParams} from "../../tron/window"
import {WindowName} from "../../tron/window-manager"
import {
  WindowsAuthCallbackMsg,
  WindowsInitialStateMsg,
  WindowsNewSearchTabMsg,
  WindowsOpenDirectorySelect,
  WindowsOpenMsg
} from "../types"

export type NewTabSearchParams = {
  href: string
  isNewWin?: boolean
}

export default {
  open(
    name: WindowName,
    params: Partial<WindowParams>,
    state: State
  ): WindowsOpenMsg {
    return {
      channel: "windows:open",
      name,
      params,
      state
    }
  },
  newSearchTab(params: NewTabSearchParams): WindowsNewSearchTabMsg {
    return {
      channel: "windows:newSearchTab",
      params
    }
  },
  initialState(id: string): WindowsInitialStateMsg {
    return {
      channel: "windows:initialState",
      id
    }
  },
  openDirectorySelect(): WindowsOpenDirectorySelect {
    return {
      channel: "windows:openDirectorySelect"
    }
  },
  authCallback(workspaceId: string, code: string): WindowsAuthCallbackMsg {
    return {
      channel: "windows:authCallback",
      workspaceId,
      code
    }
  }
}

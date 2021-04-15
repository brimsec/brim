import {ipcRenderer} from "electron"
import {
  serializeState,
  toAccessTokenKey,
  toRefreshTokenKey
} from "../../auth0/utils"
import {BrimWorkspace} from "../../brim"
import ipc from "../../electron/ipc"
import invoke from "../../electron/ipc/invoke"
import {getAuth0} from "./get-auth-0"

export const login = (ws: BrimWorkspace, abortSignal: AbortSignal) => (
  dispatch
): Promise<string> => {
  const client = dispatch(getAuth0(ws))

  const handleAuth = (resolve, reject) => async (
    event,
    {workspaceId, code}
  ) => {
    if (!code) return reject("No code returned from login")
    try {
      const {accessToken, refreshToken} = await client.exchangeCode(code)

      // store both tokens in os default keychain
      invoke(ipc.secrets.setKey(toAccessTokenKey(workspaceId), accessToken))
      invoke(ipc.secrets.setKey(toRefreshTokenKey(workspaceId), refreshToken))

      resolve(accessToken)
    } catch (e) {
      console.error("error exchanging code for tokens: ", e)
      reject(e)
    }
  }

  client.openLoginUrl(
    serializeState({workspaceId: ws.id, windowId: global.windowId})
  )
  return new Promise<string>((res, rej) => {
    const handleAuthCb = handleAuth(res, rej)
    ipcRenderer.once("windows:authCallback", handleAuthCb)
    abortSignal.addEventListener("abort", () => {
      ipcRenderer.removeListener("windows:authCallback", handleAuthCb)
      res()
    })
  })
}

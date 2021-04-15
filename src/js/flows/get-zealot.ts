import {createFetcher, FetchArgs, Zealot} from "zealot"
import {ZFetcher, ZReponse} from "../../../zealot/types"
import {validateToken} from "../auth0/utils"
import {BrimWorkspace} from "../brim"
import ErrorFactory from "../models/error-factory"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import Workspaces from "../state/Workspaces"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {getAuthCredentials} from "./workspace/get-auth-credentials"

const createBrimFetcher = (dispatch, getState) => {
  return (hostPort: string): ZFetcher => {
    const {promise, stream, upload} = createFetcher(hostPort)

    const setWorkspaceAuthArgs = async (
      ws: BrimWorkspace,
      args: FetchArgs
    ): Promise<FetchArgs> => {
      if (!ws.authType || ws.authType === "none") return {...args}

      const newArgs = {...args}

      let {accessToken} = ws.authData
      if (!validateToken(accessToken)) {
        // attempt refresh
        accessToken = await dispatch(getAuthCredentials(ws))
        if (!accessToken) {
          // inform user login required by updating status
          dispatch(WorkspaceStatuses.set(ws.id, "login-required"))
          return args
        }

        await dispatch(Workspaces.setWorkspaceToken(ws.id, accessToken))
      }

      const bearerToken = `Bearer ${accessToken}`
      if (newArgs.headers) newArgs.headers.append("Authorization", bearerToken)
      else newArgs.headers = new Headers({Authorization: bearerToken})

      return newArgs
    }

    const wrappedPromise = async (args: FetchArgs): Promise<any> => {
      const ws = Current.mustGetWorkspace(getState())
      return promise(await setWorkspaceAuthArgs(ws, args)).catch((e) => {
        if (ErrorFactory.create(e).type === "NetworkError") {
          dispatch(
            WorkspaceStatuses.set(
              Current.getWorkspaceId(getState()),
              "disconnected"
            )
          )
        }
        throw e
      })
    }

    const wrappedStream = async (args: FetchArgs): Promise<ZReponse> => {
      const ws = Current.mustGetWorkspace(getState())
      return stream(await setWorkspaceAuthArgs(ws, args))
    }

    const wrappedUpload = async (args: FetchArgs): Promise<ZReponse> => {
      const ws = Current.mustGetWorkspace(getState())
      return upload(await setWorkspaceAuthArgs(ws, args))
    }

    return {
      promise: wrappedPromise,
      stream: wrappedStream,
      upload: wrappedUpload
    }
  }
}

export const getZealot = (): Thunk<Zealot> => (
  dispatch,
  getState,
  {createZealot}
) => {
  const ws = Current.mustGetWorkspace(getState())

  return createZealot(ws.getAddress(), {
    fetcher: createBrimFetcher(dispatch, getState)
  })
}

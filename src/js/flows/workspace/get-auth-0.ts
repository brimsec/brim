import Auth0Client from "../../auth0"
import {BrimWorkspace} from "../../brim"
import Current from "../../state/Current"
import {Thunk} from "../../state/types"

export const getAuth0 = (ws?: BrimWorkspace): Thunk<Auth0Client> => (
  dispatch,
  getState
) => {
  if (!ws) ws = Current.getWorkspace(getState())
  if (!ws.authType || ws.authType !== "auth0") return null
  if (!ws.authData) throw new Error("authData missing from workspace")

  const {clientId, domain} = ws.authData

  return new Auth0Client(clientId, domain)
}

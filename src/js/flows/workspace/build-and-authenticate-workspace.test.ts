import {ipcRenderer, remote} from "electron"
import jwtDecode from "jwt-decode"
import Workspaces from "src/js/state/Workspaces"
import WorkspaceStatuses from "src/js/state/WorkspaceStatuses"
import {mocked} from "ts-jest/utils"
import {createZealotMock} from "zealot"
import Auth0Client from "../../auth0"
import {AuthType} from "../../state/Workspaces/types"
import initTestStore from "../../test/init-test-store"
import {
  buildAndAuthenticateWorkspace,
  ConnectionError,
  LoginError
} from "./build-and-authenticate-workspace"

jest.mock("jwt-decode")
jest.mock("../../auth0")
jest.mock("electron", () => ({
  ipcRenderer: {
    invoke: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn()
  },
  remote: {
    dialog: {
      showMessageBox: jest.fn()
    }
  }
}))

const fixtures = {
  secureMethodAuth: {
    kind: "auth0",
    auth0: {
      client_id: "testClientId",
      domain: "testDomain"
    }
  },
  publicMethodAuth: {
    kind: "none"
  },
  newWorkspace: {
    id: "1",
    name: "testWorkspaceName",
    host: "testHost",
    port: "testPort"
  },
  accessToken: "testAccessToken",
  refreshToken: "testRefreshToken",
  validDate: Math.floor(Date.now() / 1000 + 60),
  expiredDate: Math.floor(Date.now() / 1000 - 60),
  version: {version: "1"}
}

let store, zealot, ctl
let auth0ClientMock, jwtDecodeMock, ipcRendererMock, remoteMock
beforeEach(() => {
  auth0ClientMock = mocked(Auth0Client)
  jwtDecodeMock = mocked(jwtDecode)
  remoteMock = mocked(remote)
  ipcRendererMock = mocked(ipcRenderer)

  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  ctl = new AbortController()
})

const expectWorkspace = (ws, status) => {
  const state = store.getState()
  expect(Workspaces.id(ws.id)(state)).toEqual(ws)
  expect(WorkspaceStatuses.get(ws.id)(state)).toEqual(status)
}

describe("success cases", () => {
  beforeEach(() => {
    zealot
      .stubPromise("version", fixtures.version)
      .stubPromise("spaces.list", [{name: "dataSpace", id: "1"}], "always")
  })

  test("new public workspace", async () => {
    zealot.stubPromise("authMethod", fixtures.publicMethodAuth)

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fixtures.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...fixtures.newWorkspace,
        ...fixtures.version,
        authType: "none"
      },
      "connected"
    )
  })

  test("existing public workspace, updated version", async () => {
    const existingWs = {
      ...fixtures.newWorkspace,
      version: "0",
      authType: "none" as AuthType
    }
    store.dispatch(Workspaces.add(existingWs))
    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(1)
    expectWorkspace(
      {
        ...existingWs,
        ...fixtures.version
      },
      "connected"
    )
  })

  test("existing secure workspace -> valid token from secrets", async () => {
    const existingWs = {
      ...fixtures.newWorkspace,
      ...fixtures.version,
      authType: "auth0" as AuthType,
      authData: {
        clientId: fixtures.secureMethodAuth.auth0.client_id,
        domain: fixtures.secureMethodAuth.auth0.domain
      }
    }
    store.dispatch(Workspaces.add(existingWs))
    ipcRendererMock.invoke.mockReturnValueOnce(fixtures.accessToken)
    jwtDecodeMock.mockReturnValueOnce({
      exp: fixtures.validDate
    })

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(1)
    expectWorkspace(
      {
        ...existingWs,
        authData: {...existingWs.authData, accessToken: fixtures.accessToken}
      },
      "connected"
    )
  })

  test("existing secure workspace -> no token -> succeed refresh", async () => {
    const existingWs = {
      ...fixtures.newWorkspace,
      ...fixtures.version,
      authType: "auth0" as AuthType,
      authData: {
        clientId: fixtures.secureMethodAuth.auth0.client_id,
        domain: fixtures.secureMethodAuth.auth0.domain
      }
    }
    store.dispatch(Workspaces.add(existingWs))
    // no access token in secrets
    ipcRendererMock.invoke.mockReturnValueOnce("")
    // do have refresh token though
    ipcRendererMock.invoke.mockReturnValueOnce(fixtures.refreshToken)
    auth0ClientMock.mockImplementationOnce(() => ({
      refreshAccessToken: jest.fn().mockReturnValueOnce(fixtures.accessToken)
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...existingWs,
        authData: {...existingWs.authData, accessToken: fixtures.accessToken}
      },
      "connected"
    )
  })

  test("existing secure workspace -> expired token -> succeed refresh", async () => {
    const existingWs = {
      ...fixtures.newWorkspace,
      ...fixtures.version,
      authType: "auth0" as AuthType,
      authData: {
        clientId: fixtures.secureMethodAuth.auth0.client_id,
        domain: fixtures.secureMethodAuth.auth0.domain
      }
    }
    store.dispatch(Workspaces.add(existingWs))
    ipcRendererMock.invoke.mockReturnValueOnce("expiredToken")
    jwtDecodeMock.mockReturnValueOnce({exp: fixtures.expiredDate})
    ipcRendererMock.invoke.mockReturnValueOnce(fixtures.refreshToken)
    auth0ClientMock.mockImplementationOnce(() => ({
      refreshAccessToken: jest.fn().mockReturnValueOnce(fixtures.accessToken)
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(1)
    expectWorkspace(
      {
        ...existingWs,
        authData: {...existingWs.authData, accessToken: fixtures.accessToken}
      },
      "connected"
    )
  })

  test("new secure workspace -> login required -> cancel dialog", async () => {
    zealot.stubPromise("authMethod", fixtures.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 1})

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fixtures.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(true)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })

  test("new secure workspace -> login required -> abort login", async () => {
    zealot.stubPromise("authMethod", fixtures.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 0})

    setTimeout(() => ctl.abort(), 20)
    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fixtures.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(true)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })

  test("new secure workspace -> login required -> succeed login", async () => {
    zealot.stubPromise("authMethod", fixtures.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 0})
    ipcRendererMock.once = async (_channel, handleAuthCb) => {
      await handleAuthCb("mockEvent", {
        workspaceId: fixtures.newWorkspace.id,
        code: "mockCode"
      })
    }
    auth0ClientMock.mockImplementationOnce(() => ({
      openLoginUrl: jest.fn(),
      exchangeCode: jest.fn().mockReturnValueOnce({
        accessToken: fixtures.accessToken,
        refreshToken: fixtures.refreshToken
      })
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fixtures.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    const {domain, client_id: clientId} = fixtures.secureMethodAuth.auth0
    expectWorkspace(
      {
        ...fixtures.newWorkspace,
        ...fixtures.version,
        authType: fixtures.secureMethodAuth.kind,
        authData: {clientId, domain, accessToken: fixtures.accessToken}
      },
      "connected"
    )
  })
})

describe("failure cases", () => {
  test("new generic workspace -> connection failure", async () => {
    // no version mock setup -> connection error
    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fixtures.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeInstanceOf(ConnectionError)
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })

  test("new secure workspace -> login required -> login failure", async () => {
    zealot.stubPromise("version", fixtures.version)
    zealot.stubPromise("authMethod", fixtures.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 0})
    ipcRendererMock.once = async (_channel, handleAuthCb) => {
      await handleAuthCb("mockEvent", {
        workspaceId: fixtures.newWorkspace.id,
        // no code, login failed
        code: undefined
      })
    }
    auth0ClientMock.mockImplementationOnce(() => ({
      openLoginUrl: jest.fn()
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fixtures.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeInstanceOf(LoginError)
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })
})

import fsExtra from "fs-extra"

import path from "path"
import os from "os"

import disableLogger from "../../test/helpers/disable-logger"
import formatSessionState from "./format-session-state"
import initTestStore from "../../test/init-test-store"
import tron from "./"

const dir = path.join(os.tmpdir(), "session.test.ts")
const file = path.join(dir, "appState.json")

disableLogger()
beforeEach(() => fsExtra.ensureDir(dir))
afterEach(() => fsExtra.remove(dir))

test("session loading with migrations", async () => {
  const state = initTestStore().getState()
  const migrations = await tron.migrations()
  const session = tron.session(file)
  const data = formatSessionState([], state)

  await session.save(data)
  await session.load()

  expect(session.getVersion()).toEqual(migrations.getLatestVersion())
})

test("loading state from release 0.8.0 resets state", async () => {
  const v8 = {
    order: [],
    windows: {},
    globalState: {investigation: [], spaces: {zqd: {}}, version: "6"}
  }
  fsExtra.writeJSONSync(file, v8)

  const session = tron.session(file)
  const data = await session.load()
  const latestVersion = (await tron.migrations()).getLatestVersion()

  expect(data).toBe(undefined)
  expect(session.getVersion()).toBe(latestVersion)
})

test("loading state from a 0.9.1 release migrates", () => {
  const testState = path.join(__dirname, "../../test/states/v0.9.1.json")
  fsExtra.copySync(testState, file)
  const session = tron.session(file)

  return expect(session.load()).resolves.toEqual({
    globalState: expect.any(Object),
    order: expect.any(Array),
    windows: expect.any(Object)
  })
})

test("failing to load sets session to latest version", async () => {
  fsExtra.writeFileSync(file, "this aint json")
  const session = tron.session(file)
  const data = await session.load()
  const latestVersion = (await tron.migrations()).getLatestVersion()

  expect(session.getVersion()).toEqual(latestVersion)
  expect(data).toBe(undefined)
})

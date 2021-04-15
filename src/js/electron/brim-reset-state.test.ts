import {app} from "electron"
import {ZQD} from "ppl/zqd/zqd"
import {Brim} from "./brim"
import tron from "./tron"
import windowManager from "./tron/window-manager"

function mockZqd() {
  const zqd = new ZQD("test", "srun", "supdate", "zrun")
  jest.spyOn(zqd, "start").mockImplementation(() => {})
  jest.spyOn(zqd, "close").mockImplementation(() => Promise.resolve())
  return zqd
}

function mockSession() {
  const session = tron.session()
  jest.spyOn(session, "delete").mockImplementation(() => Promise.resolve())
  jest.spyOn(session, "save").mockImplementation(() => Promise.resolve())
  return session
}

function mockWindows() {
  const windows = windowManager()
  jest
    .spyOn(windows, "confirmQuit")
    .mockImplementation(() => Promise.resolve(true))
  jest
    .spyOn(windows, "prepareQuit")
    .mockImplementation(() => Promise.resolve([]))
  jest.spyOn(windows, "quit").mockImplementation(() => Promise.resolve())
  return windows
}

test("reset state", async () => {
  const brim = new Brim({
    zqd: mockZqd(),
    session: mockSession(),
    windows: mockWindows()
  })

  await brim.start()
  await brim.resetState()

  expect(brim.session.delete).toHaveBeenCalled()
  expect(brim.session.save).not.toHaveBeenCalled()
  expect(app.relaunch).toHaveBeenCalled()
  expect(brim.isQuitting).toBe(true)
})

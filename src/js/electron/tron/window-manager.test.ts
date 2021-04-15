import {ipcMain} from "electron"
import tron from "./"

test("serialize each window", async () => {
  const manager = tron.windowManager()
  manager.openWindow("search")
  // @ts-ignore
  ipcMain.once.mockReset()
  setTimeout(() => {
    // @ts-ignore
    const [_replyChan, callback] = ipcMain.once.mock.calls[0]
    callback("e", "<Mock state from the renderer>")
  }, 10)

  const data = await manager.serialize()
  expect(data).toEqual([
    {
      id: expect.any(String),
      lastFocused: expect.any(Number),
      name: "search",
      position: [0, 0],
      size: [100, 100],
      state: "<Mock state from the renderer>"
    }
  ])
})

test("confirm quit is false", async () => {
  const manager = tron.windowManager()

  manager.openWindow("search")
  // @ts-ignore
  ipcMain.once.mockReset()
  setTimeout(() => {
    // @ts-ignore
    const [_replyChan, callback] = ipcMain.once.mock.calls[0]
    callback("e", false)
  }, 10)
  const ok = await manager.confirmQuit()
  expect(ok).toBe(false)
})

test("confirm quit is true", async () => {
  const manager = tron.windowManager()

  manager.openWindow("search")
  // @ts-ignore
  ipcMain.once.mockReset()
  setTimeout(() => {
    // @ts-ignore
    const [_replyChan, callback] = ipcMain.once.mock.calls[0]
    callback("e", true)
  }, 10)
  const ok = await manager.confirmQuit()
  expect(ok).toBe(true)
})

test("when all closed resolves", (done) => {
  const manager = tron.windowManager()
  let pending = true
  manager.whenAllClosed().then(() => (pending = false))
  setTimeout(() => {
    expect(pending).toBe(false)
    done()
  })
})

test("when all closed waits until windows are done", (done) => {
  const manager = tron.windowManager()
  manager.openWindow("search")
  let pending = true
  manager.whenAllClosed().then(() => (pending = false))
  setTimeout(() => {
    expect(pending).toBe(true)
    done()
  })
})

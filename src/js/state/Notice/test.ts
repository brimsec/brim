import AppError from "../../models/app-error"
import initTestStore from "../../test/init-test-store"
import notice from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("init state", () => {
  const state = store.getState()
  expect(notice.getError(state)).toEqual(null)
  expect(notice.getVisible(state)).toBe(false)
})

test("set an app error", () => {
  const e = new AppError()
  const state = store.dispatchAll([notice.set(e)])
  const brimError = {
    type: "AppError",
    message: "Unknown error",
    details: []
  }
  expect(notice.getError(state)).toEqual(brimError)
  expect(notice.getVisible(state)).toBe(true)
})

test("set a brim error", () => {
  const brimError = {
    type: "IngestError",
    message: "Pcap is too large to ingest",
    details: ["sort limit reached (10)"]
  }
  const state = store.dispatchAll([notice.set(brimError)])
  expect(notice.getError(state)).toEqual(brimError)
  expect(notice.getVisible(state)).toBe(true)
})

test("clear", () => {
  const e = new AppError()
  const state = store.dispatchAll([notice.set(e), notice.clear()])

  expect(notice.getError(state)).toEqual(null)
  expect(notice.getVisible(state)).toBe(true)
})

test("dismiss", () => {
  const e = new AppError()
  const state = store.dispatchAll([notice.set(e), notice.dismiss()])
  const brimError = {
    type: "AppError",
    message: "Unknown error",
    details: []
  }
  expect(notice.getError(state)).toEqual(brimError)
  expect(notice.getVisible(state)).toBe(false)
})

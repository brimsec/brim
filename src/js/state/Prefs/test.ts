import Prefs from "./"
import initTestStore from "../../test/init-test-store"

let store
beforeEach(() => {
  store = initTestStore()
})

test("the default json type config", () => {
  const state = store.getState()

  expect(Prefs.getJSONTypeConfig(state)).toBe("")
})

test("set the json types config", () => {
  const state = store.dispatchAll([Prefs.setJSONTypeConfig("/my/types.json")])

  expect(Prefs.getJSONTypeConfig(state)).toBe("/my/types.json")
})

test("set the preferred time format", () => {
  const state = store.dispatchAll([Prefs.setTimeFormat("YYYY")])

  expect(Prefs.getTimeFormat(state)).toEqual("YYYY")
})

test("set the suricata runner", () => {
  const state = store.dispatchAll([
    Prefs.setSuricataRunner("/run/suricata/run")
  ])

  expect(Prefs.getSuricataRunner(state)).toEqual("/run/suricata/run")
})

test("set the suricata updater", () => {
  const state = store.dispatchAll([
    Prefs.setSuricataUpdater("/run/suricata/update")
  ])

  expect(Prefs.getSuricataUpdater(state)).toEqual("/run/suricata/update")
})

test("set the zeek runner", () => {
  const state = store.dispatchAll([Prefs.setZeekRunner("/run/zeek/run")])

  expect(Prefs.getZeekRunner(state)).toEqual("/run/zeek/run")
})

test("set the dataDir", () => {
  const testDir = "/my/own/data/dir"
  const state = store.dispatchAll([Prefs.setDataDir(testDir)])

  expect(Prefs.getDataDir(state)).toEqual(testDir)
})

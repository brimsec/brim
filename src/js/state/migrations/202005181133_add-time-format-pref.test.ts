import Prefs from "../Prefs"
import getTestState from "../../test/helpers/get-test-state"
import migrate from "./202005181133_add-time-format-pref"

test("migrating 202005181133_addTimeFormatPref", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  const timeFormat = Prefs.getTimeFormat(next.globalState)
  expect(timeFormat).toBe("")
})

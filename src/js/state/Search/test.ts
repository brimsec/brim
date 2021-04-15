import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import {createZealotMock} from "zealot"
import brim from "../../brim"
import fixtures from "../../test/fixtures"
import initTestStore from "../../test/init-test-store"
import Spaces from "../Spaces"
import Tab from "../Tab"
import Workspaces from "../Workspaces"
import Search from "./"

const ts1 = {sec: 1, ns: 0}
const ts3 = {sec: 3, ns: 2}
const ts4 = {sec: 4, ns: 3}

describe("reducer", () => {
  let store
  const ws = fixtures("workspace1")
  const space = brim.space(fixtures("space1"))

  beforeEach(() => {
    store = initTestStore(createZealotMock().stubStream("search", []).zealot)

    store.dispatchAll([Workspaces.add(ws), Spaces.setDetail(ws.id, space)])

    store.dispatch(tabHistory.push(lakePath(space.id, ws.id)))
  })

  test("get span looks at the url", () => {
    expect(Tab.getSpan(store.getState())).toEqual(space.everythingSpan())
  })

  test("set span focus", () => {
    const state = store.dispatchAll([Search.setSpanFocus([ts3, ts4])])
    expect(Tab.getSpanFocus(state)).toEqual([ts3, ts4])
  })

  test("set span focus to null", () => {
    const state = store.dispatchAll([Search.setSpanFocus(null)])
    expect(Tab.getSpanFocus(state)).toEqual(null)
  })

  test("set span args", () => {
    const state = store.dispatchAll([Search.setSpanArgs([ts1, "now"])])
    expect(Tab.getSpanArgs(state)).toEqual([ts1, "now"])
  })
})

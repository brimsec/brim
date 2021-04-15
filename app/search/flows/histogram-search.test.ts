import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import Chart from "src/js/state/Chart"
import Handlers from "src/js/state/Handlers"
import Spaces from "src/js/state/Spaces"
import Workspaces from "src/js/state/Workspaces"
import fixtures from "src/js/test/fixtures"
import initTestStore from "src/js/test/init-test-store"
import responses from "src/js/test/responses"
import {createZealotMock} from "zealot"
import {histogramSearch} from "./histogram-search"

const countByPathResp = responses("count_by_path.txt")
const space = fixtures("space1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())

  store.dispatchAll([
    Workspaces.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Spaces.setDetail("1", space)
  ])
  store.dispatch(tabHistory.push(lakePath(space.id, "1")))
  zealot.stubStream("search", countByPathResp)
})

const submit = () => dispatch(histogramSearch())

test("zealot gets the request", async () => {
  await submit()
  const calls = zealot.calls("search")
  expect(calls.length).toBe(1)
  expect(calls[0].args).toEqual("* | every 12h count() by _path")
})

test("the chart status updates", async () => {
  const promise = submit()
  expect(select(Chart.getStatus)).toBe("FETCHING")
  await promise
  expect(select(Chart.getStatus)).toBe("SUCCESS")
})

test("registers historgram request then cleans it up", async (done) => {
  const promise = submit()
  expect(select(Handlers.get)["Histogram"]).toEqual(
    expect.objectContaining({type: "SEARCH"})
  )
  await promise
  // The promise only waits for the table, might be good to return two
  // promises so people can decide what they want to wait for.
  setTimeout(() => {
    expect(select(Handlers.get)["Histogram"]).toBe(undefined)
    done()
  })
})

test("aborts previous histogram request", async () => {
  const abort = jest.fn()
  dispatch(Handlers.register("Histogram", {type: "SEARCH", abort}))
  await submit()
  expect(abort).toHaveBeenCalledTimes(1)
})

test("populates the chart", async () => {
  await submit()
  expect(select(Chart.getData)).toMatchSnapshot()
})

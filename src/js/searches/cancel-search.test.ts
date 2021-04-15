import Handlers from "../state/Handlers"
import {SearchHandler} from "../state/Handlers/types"
import initTestStore from "../test/init-test-store"

describe("Handlers reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
  })

  function createHandler(abortFn): SearchHandler {
    return {
      type: "SEARCH",
      abort: abortFn
    }
  }

  test("#abort all", () => {
    const killFunc = jest.fn()

    store.dispatchAll([
      Handlers.register("Histogram", createHandler(killFunc)),
      Handlers.register("Logs", createHandler(killFunc)),
      Handlers.abortAll()
    ])

    expect(killFunc).toHaveBeenCalledTimes(2)
  })

  test("#abort", () => {
    const killFunc = jest.fn()

    store.dispatchAll([
      Handlers.register("Histogram", createHandler(killFunc)),
      Handlers.register("Logs", createHandler(killFunc)),
      Handlers.abort("Histogram")
    ])

    expect(killFunc).toHaveBeenCalledTimes(1)
  })
})

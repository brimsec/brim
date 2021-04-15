import MouseoverWatch from "./mouseover-watch"

let watcher
beforeEach(() => {
  watcher = new MouseoverWatch()
  watcher.addListener()
})

afterEach(() => {
  watcher.removeListener()
})

test("runs with defaults", () => {
  watcher.run([0, 0])
})

test("run the default on enter", () => {
  watcher.condition(() => true).run([0, 0])
})

test("run the default on exit", () => {
  watcher
    .condition(([x]) => x === 42)
    .run([42, 42])
    .run([0, 0])
})

test("runs the condition", (done) => {
  const condition = jest.fn()
  watcher.condition(condition)

  document.dispatchEvent(new MouseEvent("mousemove"))

  setTimeout(() => {
    expect(condition).toHaveBeenCalled()
    done()
  })
})

test("onEnter is called when entering", () => {
  const enter = jest.fn()
  watcher
    .condition(() => true)
    .onEnter(enter)
    .run([42, 42])

  expect(enter).toHaveBeenCalled()
})

test("fires onEnter once when it enters", () => {
  const enter = jest.fn()
  watcher
    .condition(() => true)
    .onEnter(enter)
    .run([42, 42])
    .run([42, 42])
    .run([42, 42])
    .run([42, 42])

  expect(enter).toHaveBeenCalledTimes(1)
})

test("onExit is called when leaving", () => {
  const exit = jest.fn()

  watcher
    .condition(([x]) => x === 1)
    .onExit(exit)
    .run([1, 1])
    .run([2, 2])

  expect(exit).toHaveBeenCalled()
})

test("onExit is called once when outside", () => {
  const exit = jest.fn()

  watcher
    .condition(([x]) => x === 1)
    .onExit(exit)
    .run([1, 1])
    .run([2, 2])
    .run([2, 2])

  expect(exit).toHaveBeenCalledTimes(1)
})

test("exit delay", (done) => {
  const exit = jest.fn()
  const enter = jest.fn()

  watcher
    .condition(([x, y]) => x === 42 && y === 42)
    .onExit(exit)
    .onEnter(enter)
    .exitDelay(10)
    .run([0, 0])
    .run([42, 42])
    .run([0, 0])

  expect(enter).toHaveBeenCalled()
  expect(exit).not.toHaveBeenCalled()

  setTimeout(() => {
    expect(exit).toHaveBeenCalledTimes(1)
    done()
  }, 10)
})

test("exiting with a delay then re-entering cancels timeout", (done) => {
  const exit = jest.fn()
  const enter = jest.fn()

  watcher
    .condition(([x, y]) => x === 42 && y === 42)
    .onExit(exit)
    .onEnter(enter)
    .exitDelay(10)
    .run([0, 0])
    .run([42, 42])
    .run([0, 0])
    .run([42, 42])

  expect(enter).toHaveBeenCalledTimes(1)

  setTimeout(() => {
    expect(exit).not.toHaveBeenCalled()
    done()
  }, 10)
})

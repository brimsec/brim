import * as TimeWindow from "./time-window"
import {DateTuple} from "./time-window"

test("duration as seconds", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0),
    new Date(2000, 1, 15, 12, 30, 45)
  ]
  const duration = TimeWindow.duration(window, "seconds")

  expect(duration).toBe(45)
})

test("duration as ms", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 12, 30, 45, 0)
  ]
  const duration = TimeWindow.duration(window, "ms")

  expect(duration).toBe(45000)
})

test("humanDuration", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 15, 30, 45, 0)
  ]
  const duration = TimeWindow.humanDuration(window)

  expect(duration).toBe("3 hours")
})

test("inSameUnit when false", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 15, 30, 45, 0)
  ]
  const duration = TimeWindow.inSameUnit(window, "seconds")

  expect(duration).toBe(false)
})

test("inSameUnit when true", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 15, 30, 45, 0)
  ]
  const duration = TimeWindow.inSameUnit(window, "months")

  expect(duration).toBe(true)
})

test("floorAndCeil", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 45, 0)
  ]

  const newWindow = TimeWindow.floorAndCeil(window, "minutes")

  expect(newWindow).toEqual([
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 59, 999)
  ])
})

test("shift forward", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 45, 0)
  ]

  const newWindow = TimeWindow.shift(window, 1000)

  expect(newWindow).toEqual([
    new Date(2000, 1, 15, 12, 30, 1, 0),
    new Date(2000, 1, 15, 13, 30, 46, 0)
  ])
})

test("shift backwards", () => {
  const window: DateTuple = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 45, 0)
  ]

  const newWindow = TimeWindow.shift(window, -1, "seconds")

  expect(newWindow).toEqual([
    new Date(2000, 1, 15, 12, 29, 59, 0),
    new Date(2000, 1, 15, 13, 30, 44, 0)
  ])
})

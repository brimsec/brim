import brim from "../brim"
import histogramInterval from "./histogram-interval"
import {DateTuple} from "./time-window"

const start = new Date()

test("returns the proper format", () => {
  const end = brim
    .time(start)
    .add(5, "minutes")
    .toDate()
  const timeWindow: DateTuple = [start, end]

  expect(histogramInterval(timeWindow)).toEqual({
    number: 1,
    unit: "second",
    roundingUnit: "second"
  })
})

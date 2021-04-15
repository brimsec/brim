import {flattenJoin, indexOfLastChange, swap, toFront} from "./Array"

test("#indexOfLastChange", () => {
  const logsTs = [
    new Date("2018-1-1 10:00"),
    new Date("2018-1-1 11:00"),
    new Date("2018-1-1 12:00"),
    new Date("2018-1-1 13:00")
  ]

  const index = indexOfLastChange(logsTs)
  expect(index).toBe(2)
})

test("#indexOfLastChange with accessor", () => {
  const logsTs = [
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 11:00")},
    {ts: new Date("2018-1-1 13:00")},
    {ts: new Date("2018-1-1 13:00")}
  ]

  const index = indexOfLastChange(logsTs, (obj) => obj.ts)
  expect(index).toBe(1)
})

test("#indexOfLastChange with empty array", () => {
  const index = indexOfLastChange([], (thing) => thing.get("hi"))
  expect(index).toBe(-1)
})

test("#indexOfLastChange when all the same", () => {
  const index = indexOfLastChange([1, 1, 1, 1])
  expect(index).toBe(-1)
})

test("#indexOfLastChange when all same with accessor", () => {
  const logsTs = [
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")}
  ]

  const index = indexOfLastChange(logsTs, (obj) => obj.ts)
  expect(index).toBe(-1)
})

describe("#flattenJoin", () => {
  test("three arrays", () => {
    const result = flattenJoin([["1"], ["2"], ["3"]], "|")
    expect(result.join("")).toEqual("1|2|3")
  })

  test("two arrays", () => {
    const result = flattenJoin([["1"], ["2"]], "|")
    expect(result.join("")).toEqual("1|2")
  })

  test("one array", () => {
    const result = flattenJoin([["1"]], "|")
    expect(result.join("")).toEqual("1")
  })

  test("one array with an empty array", () => {
    const result = flattenJoin([["1"], []], "|")
    expect(result.join("")).toEqual("1")
  })

  test("on array with many empty arrays", () => {
    const result = flattenJoin([[], ["2"], [], ["3"]], "|")
    expect(result.join("")).toEqual("2|3")
  })
})

describe("#toFront", () => {
  let array
  beforeEach(() => {
    array = [1, 2, 3, 4, 5]
  })

  test("item exists", () => {
    const newArray = toFront(array, (item) => item === 4)

    expect(newArray).toEqual([4, 1, 2, 3, 5])
  })

  test("item does not exist", () => {
    const newArray = toFront(array, (item) => item === 10)

    expect(newArray).toEqual([1, 2, 3, 4, 5])
  })

  test("first item ", () => {
    const newArray = toFront(array, (item) => item === 1)

    expect(newArray).toEqual([1, 2, 3, 4, 5])
  })

  test("last item", () => {
    const newArray = toFront(array, (item) => item === 5)

    expect(newArray).toEqual([5, 1, 2, 3, 4])
  })
})

test("swap", () => {
  const a = [0, 1, 2, 3, 4, 5]

  expect(swap(a, 4, 2)).toEqual([0, 1, 4, 3, 2, 5])
})

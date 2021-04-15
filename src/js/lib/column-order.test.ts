import columnOrder from "./column-order"

const col = (name) => ({name, type: "any", key: name})
const a = col("a")
const b = col("b")
const c = col("c")
const path = col("_path")
const event_type = col("event_type")
const ts = col("ts")

test("ts", () => {
  expect(columnOrder([a, ts])).toEqual([ts, a])
})

test("path", () => {
  expect(columnOrder([b, path])).toEqual([path, b])
})

test("event_type", () => {
  expect(columnOrder([b, event_type])).toEqual([event_type, b])
})

test("ts, path", () => {
  expect(columnOrder([b, ts, a, path, c])).toEqual([ts, path, b, a, c])
})

test("ts, event_path", () => {
  expect(columnOrder([b, event_type, a, ts, c])).toEqual([
    ts,
    event_type,
    b,
    a,
    c
  ])
})

test("ts, event_path, path", () => {
  expect(columnOrder([b, event_type, a, ts, c, path])).toEqual([
    ts,
    path,
    event_type,
    b,
    a,
    c
  ])
})

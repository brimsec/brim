import formatDur from "./format-dur"

const s = (n) => n * 1000
const m = (n) => s(n) * 60
const h = (n) => m(n) * 60
const d = (n) => h(n) * 24

test("No start", () => {
  expect(formatDur(undefined, new Date(500))).toBe("Not available")
})

test("No end", () => {
  expect(formatDur(new Date(500), undefined)).toBe("Not available")
})

test("500 ms", () => {
  expect(formatDur(new Date(0), new Date(500))).toBe("0.5 seconds")
})

test("10 seconds", () => {
  expect(formatDur(new Date(0), new Date(s(10)))).toBe("10 seconds")
})

test("2 minutes 48 seconds", () => {
  expect(formatDur(new Date(0), new Date(m(2) + s(48)))).toBe(
    "2 minutes 48 seconds"
  )
})

test("1 hour 4 minutes`", () => {
  expect(formatDur(new Date(0), new Date(h(1) + m(4) + s(48)))).toBe(
    "1 hour 4 minutes"
  )
})

test("5 days 20 hours", () => {
  const end = d(5) + h(20) + m(10) + s(13)
  expect(formatDur(new Date(0), new Date(end))).toBe("5 days 20 hours")
})

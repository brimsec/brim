import brim from "./"

const validResults = {
  "now-10m": {op: "-", amount: 10, unit: "m"},
  "now - 100s": {op: "-", amount: 100, unit: "s"},
  "now - 60m": {op: "-", amount: 60, unit: "m"},
  "now - 25h": {op: "-", amount: 25, unit: "h"},
  "now -0h": {op: "-", amount: 0, unit: "h"},
  " now-45d ": {op: "-", amount: 45, unit: "d"},
  " now-6w ": {op: "-", amount: 6, unit: "w"},
  "now -  12 y ": {op: "-", amount: 12, unit: "y"}
}

for (const [string, expectedAst] of Object.entries(validResults)) {
  test("toAst => " + string, () => {
    const ast = brim.relTime(string).toAst()

    expect(ast).toEqual(expectedAst)
  })
}

test("case insensitivity", () => {
  const a = ["now", "NOW", "NoW", "   Now", "now   ", " now "]
  a.forEach((string) => {
    const ast = brim.relTime(string).toAst()

    expect(ast).toEqual({
      op: null,
      amount: 0,
      unit: "s"
    })
  })
})

test("bad result", () => {
  expect(() => brim.relTime("blah blah").toTs()).toThrow(
    "Invalid relTime expression: blah blah"
  )
})

test("isValid when false", () => {
  expect(brim.relTime("nope!").isValid()).toBe(false)
})

test("isValid when true", () => {
  for (const string in validResults) {
    expect(brim.relTime(string).isValid()).toBe(true)
  }
})

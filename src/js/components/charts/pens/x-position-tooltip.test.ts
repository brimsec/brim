import {xPosition} from "./x-position-tooltip"

describe("#xPosition", () => {
  let parentWidth, padding, width
  beforeEach(() => {
    parentWidth = 1000
    padding = 20
    width = 100
  })

  test("right of the mouse", () => {
    expect(xPosition(0, width, parentWidth, padding)).toBe("20px")
    expect(xPosition(879, width, parentWidth, padding)).toBe("899px")
  })

  test("left of the mouse", () => {
    expect(xPosition(880, width, parentWidth, padding)).toBe("760px")
    expect(xPosition(1000, width, parentWidth, padding)).toBe("880px")
  })
})

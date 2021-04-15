import Controller from "./Controller"

const data = {
  size: 800,
  sections: [
    {id: "1", min: 24},
    {id: "2", min: 24},
    {id: "3", min: 24},
    {id: "4", min: 24}
  ]
}

test("constructor", () => {
  const views = Controller.parse(data)
  expect(views.at(0).size).toEqual(200)
})

test("distribute positive beyond max", () => {
  const data = {
    size: 1000,
    sections: [
      {id: "1", min: 24, max: 100},
      {id: "2", min: 24, max: 100},
      {id: "3", min: 24, max: 100},
      {id: "4", min: 24}
    ]
  }
  const views = Controller.parse(data)

  expect(views.at(0).size).toBe(100)
  expect(views.at(1).size).toBe(100)
  expect(views.at(2).size).toBe(100)
  expect(views.at(3).size).toBe(700)
})

test("distribute a fractional amount", () => {
  const data = {
    size: 1000.1,
    sections: [
      {id: "1", min: 24, max: 100},
      {id: "2", min: 24, max: 100},
      {id: "3", min: 24, max: 100},
      {id: "4", min: 24}
    ]
  }
  const views = Controller.parse(data)

  expect(views.at(0).size).toBe(100)
  expect(views.at(1).size).toBe(100)
  expect(views.at(2).size).toBe(100)
  expect(views.at(3).size).toBe(700)
})

test("resize", () => {
  const data = {
    size: 800,
    sections: [
      {id: "1", min: 24, size: 200},
      {id: "2", min: 24, size: 200},
      {id: "3", min: 24, size: 200},
      {id: "4", min: 24, size: 200}
    ]
  }
  const views = Controller.parse(data)
  views.drag(1, -100)
  expect(views.map((child) => child.size)).toEqual([100, 300, 200, 200])
  views.drag(2, 200)
  expect(views.map((child) => child.size)).toEqual([100, 500, 24, 176])
})

test("resize super small", () => {
  const data = {
    size: 800,
    sections: [
      {id: "1", min: 24, size: 200},
      {id: "2", min: 24, size: 200},
      {id: "3", min: 24, size: 200},
      {id: "4", min: 24, size: 200}
    ]
  }
  const views = Controller.parse(data)
  views.drag(3, 2000)
  expect(views.map((child) => child.size)).toEqual([200, 200, 376, 24])
})

test("resize super big", () => {
  const data = {
    size: 800,
    sections: [
      {id: "1", min: 24, size: 200},
      {id: "2", min: 24, size: 200},
      {id: "3", min: 24, size: 200},
      {id: "4", min: 24, size: 200}
    ]
  }
  const views = Controller.parse(data)
  views.drag(1, -2000)
  expect(views.map((child) => child.size)).toEqual([24, 376, 200, 200])
})

test("resize number 1", () => {
  const data = {
    size: 800,
    sections: [
      {id: "1", min: 24, size: 200},
      {id: "2", min: 24, size: 200},
      {id: "3", min: 24, size: 200},
      {id: "4", min: 24, size: 200}
    ]
  }
  const views = Controller.parse(data)
  views.drag(0, -2000)
  expect(views.map((child) => child.size)).toEqual([200, 200, 200, 200])
})

test("resize number 1 positive", () => {
  const data = {
    size: 800,
    sections: [
      {id: "1", min: 24, size: 200},
      {id: "2", min: 24, size: 200},
      {id: "3", min: 24, size: 200},
      {id: "4", min: 24, size: 200}
    ]
  }
  const views = Controller.parse(data)
  views.drag(0, 2000)
  expect(views.map((child) => child.size)).toEqual([200, 200, 200, 200])
})

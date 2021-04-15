import Section from "./Section"

test("constructor min size", () => {
  const args = {id: "1", size: 0, min: 50, max: 200}
  const s = Section.parse(args)
  expect(s.size).toBe(50)
})

test("constructor max size", () => {
  const args = {id: "1", size: 500, min: 50, max: 200}
  const s = Section.parse(args)
  expect(s.size).toBe(200)
})

test("constructor max size when null", () => {
  const args = {id: "1", size: 0, min: 50, max: undefined}
  const s = Section.parse(args)
  expect(s.size).toBe(50)
})

test("serialize boomarang", () => {
  const section = new Section("mysection")
  const data = section.serialize()
  const section2 = Section.parse(JSON.parse(JSON.stringify(data)))
  expect(section2.serialize()).toEqual(data)
})

test("constructor max size when undefined", () => {
  const args = {id: "1", size: 500, min: 50, max: undefined}
  const s = Section.parse(args)
  expect(s.max).toEqual(Infinity)
})

test("resize -", () => {
  const args = {id: "1", size: 100, min: 50, max: 200}
  const s = Section.parse(args)
  const r = s.resize(-5)
  expect(r).toBe(0)
  expect(s.size).toBe(95)
})

test("resize +", () => {
  const args = {id: "1", size: 100, min: 50, max: 200}
  const s = Section.parse(args)
  const r = s.resize(5)
  expect(r).toBe(0)
  expect(s.size).toBe(105)
})

test("resize beyond min", () => {
  const args = {id: "1", size: 100, min: 50, max: 200}
  const s = Section.parse(args)
  const r = s.resize(-80)
  expect(r).toBe(-30)
  expect(s.size).toBe(50)
})

test("resize beyond max", () => {
  const args = {id: "1", size: 100, min: 50, max: 200}
  const s = Section.parse(args)
  const r = s.resize(199)
  expect(r).toBe(99)
  expect(s.size).toBe(200)
})

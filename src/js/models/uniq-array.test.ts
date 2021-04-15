import UniqArray from "./uniq-array"
import isEqual from "lodash/isEqual"

test("#push with numbers", () => {
  const uniq = new UniqArray()
  uniq.push(1)
  uniq.push(2)
  uniq.push(2)
  uniq.push(3)

  expect(uniq.toArray()).toEqual([1, 2, 3])
})

test("#push with strings", () => {
  const uniq = new UniqArray()
  uniq.push("hi")
  uniq.push("hi")
  uniq.push("bye")
  uniq.push("good morning")

  expect(uniq.toArray()).toEqual(["hi", "bye", "good morning"])
})

test("#push with objects uses ===", () => {
  const a = {name: "alice"}
  const b = {name: "bob"}
  const uniq = new UniqArray()
  uniq.push(a)
  uniq.push(b)
  uniq.push(b)
  uniq.push({name: "alice"})

  expect(uniq.toArray()).toEqual([a, b, a])
})

test("#push with a compare func", () => {
  const a = {name: "alice"}
  const b = {name: "bob"}
  const uniq = new UniqArray(isEqual)
  uniq.push(a)
  uniq.push(b)
  uniq.push(b)
  uniq.push({name: "alice"})

  expect(uniq.toArray()).toEqual([a, b])
})

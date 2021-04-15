import zeekLogInfo from "./log-info"

test("describe conn uid", () => {
  const path = zeekLogInfo("conn")
  const {desc, type} = path.describeColumn({name: "uid", type: "bstring"})

  expect(desc).toBe("A unique identifier of the connection.")
  expect(type).toBe("string")
})

test("known path", () => {
  const path = zeekLogInfo("conn")

  expect(path.isKnown()).toBe(true)
})

test("unknown path", () => {
  const path = zeekLogInfo("nopath")
  expect(path.isKnown()).toBe(false)
})

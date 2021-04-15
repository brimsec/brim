import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202010191355_addConnectionNameDefault", async () => {
  const next = await migrate({state: "v0.17.0", to: "202010191355"})

  const windowState = next.windows["7a2fd651bb"].state
  expect(windowState.clusters["localhost:9867"].name).toBe("localhost:9867")
})

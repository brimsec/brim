import createTestBrim from "itest/lib/create-test-brim"

describe("Workspace routes", () => {
  const brim = createTestBrim("workspaces.test")

  test("visiting a workspace that doesn't exist", async () => {
    try {
      await brim.navTo("/workspaces/none")
      await brim.hasText("Choose a Workspace")
    } catch (e) {
      await brim.takeScreenshot()
      throw e
    }
  })
})

import createTestBrim from "itest/lib/create-test-brim"
import {currentSpaceItem} from "src/js/test/locators"

describe("deleting a space", () => {
  const brim = createTestBrim("delete-space.test")

  test("delete a space that is open", async () => {
    await brim.ingest("sample.zng")
    await brim.rightClick(currentSpaceItem)
    await brim.clickContextMenuItem("Delete")
    await brim.hook("space-deleted")
  })
})

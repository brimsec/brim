import {toLower} from "lodash"
import itest from "../helpers/itest"

describe("Detail Pane", () => {
  // Names of the sections to test for
  const FIELDS = "fields"
  const UID = "correlation"
  const ALERTS = "related alerts"
  const HISTORY = "conn history"
  const CONNECTIONS = "related connections"
  const MD5 = "md5 correlation"

  const [brim, $] = itest("detail-pane")
  beforeAll(async () => {
    await brim.ingest("ifconfig.zng")
    await brim.search("")
    brim.clickAppMenuItem("toggle-right-pane")
    await $.findByRole("complementary", {name: "Details"})
  })

  // Helper function to perform the common actions
  async function testDetailHeaders(path, sectionNames) {
    const viewer = await $.findByRole("list", {name: "results"})
    const cells = await viewer.findAllByText(path)
    await brim.click(cells[0])
    const details = await $.findByRole("complementary", {name: "Details"})
    const sections = await details.findAllByRole("heading")
    const headers = await Promise.all(sections.map((s) => s.getText()))
    try {
      expect(headers.map(toLower)).toEqual(expect.arrayContaining(sectionNames))
    } catch (e) {
      await brim.takeScreenshot()
      throw e
    }
  }

  test("for capture loss", () => {
    return testDetailHeaders("capture_loss", [FIELDS])
  })

  test("for stats", () => {
    return testDetailHeaders("stats", [FIELDS])
  })

  test("for alert", () => {
    return testDetailHeaders("alert", [FIELDS, ALERTS, CONNECTIONS])
  })

  test("for file", () => {
    return testDetailHeaders("files", [FIELDS, MD5])
  })

  test("for http", () => {
    return testDetailHeaders("files", [FIELDS, UID])
  })

  test("for conn", () => {
    return testDetailHeaders("conn", [FIELDS, UID, HISTORY])
  })
})

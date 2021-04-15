import {Application} from "spectron"

import logStep from "../util/log-step"
import waitForResults from "../util/wait-for-results"
import {selectors} from "../../../../src/js/test/integration"
import {submitButton} from "src/js/test/locators"

export const runSearch = async (app: Application, searchText: string) => {
  // Run a search and wait for results to appear. Do not return results.
  // This is suitable for setting up the app to do something else
  // after receiving results, like a context menu test.
  await logStep("write to main search", async () => {
    const input = await app.client.$(selectors.search.input)
    await input.waitForDisplayed()
    return await input.setValue(searchText)
  })
  const button = await app.client.$(submitButton.css)
  await logStep("click the search button", () => button.click())
  return waitForResults(app)
}

export const getResults = async (
  app: Application,
  includeHeaders = true
): Promise<string[]> => {
  const viewer = await app.client.$(".viewer")
  const html = await viewer.getHTML()
  document.body.innerHTML = html
  const rows = document.querySelectorAll(".field-cell")
  let results = Array.from(rows).map((c) => c.textContent.trim())
  if (includeHeaders) {
    const header = document.querySelectorAll(".header-cell")
    const headerCells = Array.from(header).map((h) => h.textContent.trim())
    results = headerCells.concat(results)
  }
  return results
}

export default async (app: Application, searchText: string) => {
  // Run a search and return results.
  await runSearch(app, searchText)
  return getResults(app)
}

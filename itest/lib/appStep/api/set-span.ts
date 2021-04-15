import {Application} from "spectron"
import {selectors} from "../../../../src/js/test/integration"
import logStep from "../util/log-step"
import {click} from "./click"

export default async (app: Application, span: string) => {
  // Set the span given by "string", like "Whole Space". This waits for
  // results to be redrawn before returning.
  await logStep("click span selector", () => click(app, selectors.span.button))
  await logStep(`select span ${span}`, () =>
    click(app, selectors.span.menuItem(span))
  )
}

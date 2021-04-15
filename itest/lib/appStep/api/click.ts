import {Application} from "spectron"

import {retryUntil} from "../../control"

import logStep from "../util/log-step"

const waitForClickable = async (app: Application, selector: string) => {
  // In testing, it's been shown than there is no need to scroll to
  // elements to make them be visible, as long as the element's
  // container allows scrolling. However, some Internet searches suggest
  // scrolling to the element before trying to click in order to avoid
  // problems like those described in
  // https://github.com/brimdata/brim/issues/668
  const el = await app.client.$(selector)
  await logStep(`wait for element to exist: "${selector}"`, () =>
    el.waitForExist()
  )
  await logStep(`wait for element to be visible: "${selector}"`, () =>
    el.waitForDisplayed()
  )
  return logStep(`scroll to: "${selector}"`, () => el.scrollIntoView())
}

export const click = (app: Application, selector: string) =>
  logStep(`click on selector "${selector}"`, async () => {
    await waitForClickable(app, selector)

    return (await app.client.$(selector)).click()
  })

export const rightClick = (app: Application, selector: string) =>
  logStep(`right-click on selector "${selector}"`, async () => {
    await waitForClickable(app, selector)
    return (await app.client.$(selector)).click({button: "right"})
  })

export const waitForClickableButtonAndClick = async (
  app: Application,
  selector: string
) => {
  await waitForClickable(app, selector)
  // In addition to waitForClickable above, buttons must also be enabled.
  await logStep(`wait for button ${selector} to be enabled`, () =>
    retryUntil(
      async () => await (await app.client.$(selector)).getAttribute("disabled"),
      (isDisabled) => !isDisabled
    )
  )

  return (await app.client.$(selector)).click()
}

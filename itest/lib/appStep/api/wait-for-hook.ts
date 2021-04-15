import {Application} from "spectron"
import {HookName} from "src/js/state/SystemTest"
import {hookLogLocator} from "src/js/test/locators"

type WaitUntilOptions = {
  timeout?: number
  timeoutMsg?: string
  interval?: number
}

export default async function waitForHook(
  app: Application,
  name: HookName,
  options?: WaitUntilOptions
) {
  await app.client.waitUntil(async () => {
    const hooks = await app.client.$$(hookLogLocator.css)
    const lastHook = hooks[hooks.length - 1]
    if (lastHook) {
      return (await lastHook.getText()) === name
    } else {
      return false
    }
  }, options)
}

import {LOG} from "../../log"

// Use this to wrap steps around log messages. It's helpful to follow
// these steps along in a log file for debugging purposes.
export default async (stepMessage: string, f: Function) => {
  LOG.debug(`Starting step "${stepMessage}"`)
  const result = await f()
  LOG.debug(`Finished step "${stepMessage}"`)
  return result
}

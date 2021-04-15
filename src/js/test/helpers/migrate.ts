import tron from "src/js/electron/tron"
import getTestState from "./get-test-state"

export async function migrate({state: name, to}): Promise<any> {
  const state = getTestState(name)
  const migrator = await tron.migrations({from: state.version, to})
  const nextState = migrator.runPending(state)
  if (nextState.version.toString() !== to.toString()) {
    throw new Error(`Was not able to migrate to: ${to}`)
  }
  return nextState.data
}

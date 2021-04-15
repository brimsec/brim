import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export const globalDispatchMiddleware = (_store) => (next) => (action) => {
  const result = next(action)
  if (action.type.startsWith("$") && !action.remote) {
    // Don't re-broadcast a message that was broadcast to you
    invoke(ipc.globalStore.dispatch(action))
  }
  return result
}

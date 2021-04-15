export default (store: any, actions: Object[]) => {
  actions.forEach(store.dispatch)
  return store.getState()
}

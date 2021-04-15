import initMenuActionListeners from "./init-menu-action-listeners"
import initTestStore from "../test/init-test-store"

test("Each action has a listener", () => {
  const store = initTestStore()
  // @ts-ignore
  initMenuActionListeners(store)
})

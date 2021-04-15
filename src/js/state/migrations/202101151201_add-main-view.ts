import {getAllTabs} from "src/js/test/helpers/get-test-state"

export default function addMainView(state: any) {
  // Migrate state here
  for (let tab of getAllTabs(state)) {
    tab.layout.mainView = "search"
  }
  return state
}

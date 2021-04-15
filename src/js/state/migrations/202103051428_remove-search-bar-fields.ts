import {getAllTabs} from "src/js/test/helpers/get-test-state"

export default function removeSearchBarFields(state: any) {
  // Remove unused parts of the search bar
  for (const tab of getAllTabs(state)) {
    delete tab.searchBar.editing
    delete tab.searchBar.previous
    delete tab.searchBar.target
  }
  return state
}

import {Thunk} from "../types"
import {ViewerColumns} from "../Viewer/types"
import {createColumnPrefs} from "./models/column-prefs"
import {createColumnSet} from "./models/column-set"
import Columns from "./"
import selectors from "./selectors"

export default (columns: ViewerColumns): Thunk => (dispatch, getState) => {
  const set = createColumnSet(columns)
  const name = set.getName()
  const cols = set.getUniqColumns()
  const prefs = createColumnPrefs(selectors.getColumns(getState())[name])
  const defaults = prefs.getDefaults(cols)

  dispatch(Columns.updateColumns(name, defaults))
}

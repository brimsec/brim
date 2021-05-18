import detailFieldContextMenu from "ppl/menus/detailFieldContextMenu"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import {zed} from "zealot"

const contextMenu = (field: zed.Field, record: zed.Record) => (dispatch) => {
  // TODO: emit native brim event here with the field, record, and windowName here
  if (global.windowName === "detail") {
    dispatch(detailFieldContextMenu({field, record, value: field.value}))
  } else {
    dispatch(searchFieldContextMenu({field, record, value: field.value}))
  }
}

export default contextMenu

import {uniqBy, keys} from "lodash"

import {$Column, createColumn} from "./column"
import {ViewerColumns} from "../../Viewer/types"

export function createColumnSet(c: ViewerColumns) {
  return {
    getName() {
      const types = keys(c)
      if (types.length === 0) {
        return "none"
      } else if (types.length === 1) {
        return types[0]
      } else {
        return "temp"
      }
    },
    getUniqColumns() {
      let allCols = []
      for (const id in c) {
        let schema = c[id]
        let columns = schema.flatten()
        allCols = [...allCols, ...columns]
      }
      return uniqBy<$Column>(allCols.map(createColumn), "key")
    }
  }
}

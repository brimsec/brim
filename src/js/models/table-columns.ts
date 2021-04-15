import {$Column} from "../state/Columns/models/column"
import {ColumnSettingsMap, TableColumn} from "../state/Columns/types"
import columnOrder from "../lib/column-order"
import {createCell} from "../brim/cell"
import {zng} from "zealot"

export default class TableColumns {
  cols: TableColumn[]
  id: string

  constructor(
    id: string,
    columns: $Column[] = [],
    tableSetting: ColumnSettingsMap = {}
  ) {
    this.id = id
    this.cols = columnOrder(columns)
      .map(
        ({name, type, key}, index): TableColumn => ({
          ...{name, type, position: index},
          ...tableSetting[key]
        })
      )
      .sort((a, b) => (a.position > b.position ? 1 : -1))
  }

  sumWidths() {
    return this.getVisible().reduce(
      (sum, column) => (sum += column.width || 0),
      0
    )
  }

  setWidths(logs: zng.Record[]) {
    const MAX_WIDTH = 500
    const resizeHandle = 5
    const sortIcon = 11

    this.cols.forEach((col) => {
      if (col.width) return
      const colName = createCell(
        new zng.Field("", new zng.Primitive("string", col.name))
      )

      let max = colName.guessWidth() + resizeHandle + sortIcon

      logs.forEach((log) => {
        const data = log.try(col.name)
        if (data) {
          const cell = createCell(new zng.Field(name, data))
          const len = cell.guessWidth()
          if (len > max) max = len
        }
      })

      col.width = Math.min(max, MAX_WIDTH)
    })
  }

  getVisible(): TableColumn[] {
    return this.cols.filter((c) => c.isVisible)
  }

  showHeader() {
    return !(this.id === "temp" && this.allVisible())
  }

  toArray() {
    return this.cols
  }

  getColumns() {
    return this.cols
  }

  visibleCount() {
    return this.cols.filter((c) => c.isVisible).length
  }

  allVisible() {
    return this.cols.every((c) => c.isVisible)
  }
}

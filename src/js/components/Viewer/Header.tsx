import {useSelector} from "react-redux"
import React, {useMemo} from "react"

import {ViewerDimens} from "../../types"
import HeaderCell from "./header-cell"
import SearchBar from "../../state/SearchBar"
import * as Styler from "./Styler"
import TableColumns from "../../models/table-columns"
import brim from "../../brim"
import columnKey from "../../lib/column-key"

type Props = {
  dimens: ViewerDimens
  scrollLeft: number
  columns: TableColumns
}

export default function Header({dimens, scrollLeft, columns, ...rest}: Props) {
  const program = useSelector(SearchBar.getSearchProgram)
  const sorts = useMemo(() => {
    return brim
      .program(program)
      .ast()
      .sorts()
  }, [program])

  if (dimens.rowWidth === "auto") return null

  return (
    <header {...rest} style={Styler.header(dimens, scrollLeft)}>
      {columns.getVisible().map((column) => (
        <HeaderCell
          key={columnKey(column)}
          column={column}
          tableId={columns.id}
          sorts={sorts}
        />
      ))}
    </header>
  )
}

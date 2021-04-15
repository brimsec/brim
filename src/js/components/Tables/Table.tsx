import React from "react"

import {Column} from "../../types"
import FieldCell from "../field-cell"
import {zng} from "zealot"

export default function Table({className, ...props}: any) {
  return <table className={`table ${className}`} {...props} />
}

export function TableHeader({column}: {column: Column}) {
  return <th className={column.type}>{column.name}</th>
}

type Props = {
  record: zng.Record
  field: zng.Field
  onRightClick?: (f: zng.Field, r: zng.Record) => void
}

export function TableData({field, record, onRightClick}: Props) {
  const {name, data} = field

  function onContextMenu() {
    onRightClick && onRightClick(field, record)
  }

  return (
    <td onContextMenu={onContextMenu} className={`${data.getType()} ${name}`}>
      <FieldCell field={field} record={record} />
    </td>
  )
}

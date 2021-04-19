import classNames from "classnames"
import React from "react"
import {ZedField, ZedRecord} from "zealot/zed/data-types"
import {createCell} from "../brim/cell"

type Props = {field: ZedField; record: ZedRecord}

function getBackground(field, record) {
  if (field.name === "event_type" && field.data.toString() === "alert") {
    const severity = record.try("alert.severity")?.toString()
    return `alert-${severity}-bg-color`
  }
  if (field.name === "_path") {
    return `${field.data.toString()}-bg-color`
  }
}

export default function FieldCell({field, record}: Props) {
  const cell = createCell(field)
  return (
    <div
      className={classNames(
        "field-cell",
        field.name,
        field.data.kind,
        getBackground(field, record),
        {
          null: field.data.isUnset()
        }
      )}
    >
      {cell.display()}
    </div>
  )
}

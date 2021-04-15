import React from "react"
import classNames from "classnames"

import {createCell} from "../brim/cell"
import {zng} from "zealot"

type Props = {field: zng.Field; record: zng.Record}

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
        field.data.getType(),
        getBackground(field, record),
        {
          null: field.data.value === null
        }
      )}
    >
      {cell.display()}
    </div>
  )
}

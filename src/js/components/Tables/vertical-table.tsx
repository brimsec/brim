import React from "react"
import classNames from "classnames"

import Table, {TableData, TableHeader} from "./Table"
import {zjson, zng} from "zealot"

type Props = {
  descriptor: zjson.Column[]
  record: zng.Record
  onRightClick?: (f: zng.Field, r: zng.Record) => void
  light?: boolean
}

export default function VerticalTable({
  descriptor,
  record,
  onRightClick,
  light
}: Props) {
  return (
    <Table className={classNames("vertical-table", {light})}>
      <tbody>
        {descriptor.map((column, index) => (
          <tr key={index}>
            <TableHeader column={column} />
            <TableData
              record={record}
              field={new zng.Field(column.name, record.at(index))}
              onRightClick={onRightClick}
            />
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

import * as React from "react"

import Table, {TableData, TableHeader} from "./Table"
import {zjson, zng} from "zealot"

type Props = {
  descriptor: zjson.Column[]
  logs: zng.Record[]
  onRightClick?: (f: zng.Field, r: zng.Record) => void
}

export default function HorizontalTable({
  descriptor,
  logs,
  onRightClick
}: Props) {
  return (
    <Table className="horizontal-table">
      <thead>
        <tr>
          {descriptor.map((column, index) => (
            <TableHeader column={column} key={index} />
          ))}
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index}>
            {log.getFields().map((field, index) => (
              <TableData
                field={field}
                record={log}
                key={index}
                onRightClick={onRightClick}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

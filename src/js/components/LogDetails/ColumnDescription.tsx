import zeekLogInfo from "ppl/zeek/logInfo"
import React from "react"
import ReactMarkdown from "react-markdown"
import open from "../../lib/open"
import {Column} from "../../types"

type Props = {
  column: Column
  path: string
}

export default function ColumnDescription({column, path}: Props) {
  const info = zeekLogInfo(path)
  const col = info.describeColumn(column)

  return (
    <div className="column-description">
      <div className="tip-title">
        <p>{column.name}</p> <p>{col.type}</p>
      </div>
      <div className="tip-body">
        <ReactMarkdown>{col.desc}</ReactMarkdown>
      </div>
      {info.isKnown() && (
        <div className="tip-footer">
          <a onClick={() => open(info.docsUrl())}>Link to Docs</a>
        </div>
      )}
    </div>
  )
}

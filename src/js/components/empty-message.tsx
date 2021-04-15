import React from "react"
import classNames from "classnames"

export default function EmptyMessage({show}: {show: boolean}) {
  return (
    <p className={classNames("no-chart-data", {visible: show})}>
      No Chart Data
    </p>
  )
}

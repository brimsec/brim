import React from "react"
import classNames from "classnames"

type Props = {
  children: any
  className?: string
}

export default function ButtonRow({children, className, ...props}: Props) {
  return (
    <div {...props} className={classNames("button-row", className)}>
      {children}
    </div>
  )
}

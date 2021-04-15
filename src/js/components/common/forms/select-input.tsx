import React from "react"
import classNames from "classnames"

export default function SelectInput({children, className, ...rest}: any) {
  return (
    <select {...rest} className={classNames(className, "select-input")}>
      {children}
    </select>
  )
}

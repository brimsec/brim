import React from "react"
import classNames from "classnames"

export default function TextInput({className, ...rest}: any) {
  return (
    <input
      {...rest}
      type="text"
      className={classNames("text-input", className)}
    />
  )
}

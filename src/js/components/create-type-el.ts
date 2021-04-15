import * as React from "react"
import classNames from "classnames"

import {capitalize} from "../lib/Str"
import {extract} from "../stdlib/object"

export type TypeProps = {
  children?: React.ReactNode
  className?: string
  bold?: boolean
  underline?: boolean
  italic?: boolean
  "white-1"?: boolean
  "white-2"?: boolean
  "white-3"?: boolean
  "white-4"?: boolean
  "white-5"?: boolean
  "white-6"?: boolean
  "white-7"?: boolean
  "white-8"?: boolean
  "white-9"?: boolean
  "gray-1"?: boolean
  "gray-2"?: boolean
  "gray-3"?: boolean
  "gray-4"?: boolean
  "gray-5"?: boolean
  "gray-6"?: boolean
  "gray-7"?: boolean
  "gray-8"?: boolean
  "gray-9"?: boolean
}
const VARIATIONS = [
  "bold",
  "underline",
  "italic",
  "white-1",
  "white-2",
  "white-3",
  "white-4",
  "white-5",
  "white-6",
  "white-7",
  "white-8",
  "white-9",
  "gray-1",
  "gray-2",
  "gray-3",
  "gray-4",
  "gray-5",
  "gray-6",
  "gray-7",
  "gray-8",
  "gray-9"
]

export default function createTypeEl(tag: string, name: string) {
  function TypeComponent({children, className, ...props}: TypeProps) {
    className = classNames(name, className, extract(props, ...VARIATIONS))
    return React.createElement(tag, {...props, className}, children)
  }
  TypeComponent.displayName = capitalize(name)
  return TypeComponent
}

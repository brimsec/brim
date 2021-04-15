import React from "react"

import {cssVar} from "../lib/css-var"
import FileBorderSvg from "../../static/icons/file-border.svg"

const blue = cssVar("--azure")

export default function FileBorder(props: any) {
  return <FileBorderSvg {...props} fill={blue} stroke={blue} />
}

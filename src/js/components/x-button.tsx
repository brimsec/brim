import React from "react"

import X from "./icons/x-md.svg"

export default function XButton(rest: any) {
  return (
    <button {...rest} className="x-button">
      <X />
    </button>
  )
}

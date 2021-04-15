import React from "react"
import classNames from "classnames"

import {SpanArgs} from "../../state/Search/types"
import brim from "../../brim"

export default function SpanDuration({spanArgs}: {spanArgs: SpanArgs}) {
  const span = brim.span(spanArgs)
  const error = !span.isValid()
  return (
    <div className={classNames("span-duration", {error})}>
      <hr />
      <span>{error ? "!!!" : span.shortFormat()}</span>
      <hr />
    </div>
  )
}

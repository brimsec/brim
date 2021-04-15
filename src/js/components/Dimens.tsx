import React, {ReactNode, HTMLProps} from "react"

import {Rect, useResizeObserver} from "./hooks/use-resize-observer"

interface Props {
  render: (arg0: Rect) => ReactNode
}

export default function Dimens({
  render,
  ...props
}: Props & HTMLProps<HTMLDivElement>) {
  const {rect, ref} = useResizeObserver()
  return (
    <div {...props} ref={ref}>
      {render(rect)}
    </div>
  )
}

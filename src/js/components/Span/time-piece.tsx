import React, {HTMLProps} from "react"

type Props = {
  children: any
} & HTMLProps<HTMLDivElement>

export default function TimePiece({children, ...rest}: Props) {
  return (
    <div {...rest} className="time-piece">
      {children}
    </div>
  )
}

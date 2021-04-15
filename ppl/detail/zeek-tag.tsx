import classNames from "classnames"
import React from "react"
import styled from "styled-components"
import {BrimEventInterface} from "./models/brim-event"

const BG = styled.div`
  height: 18px;
  border-radius: 3px;
  display: inline-flex;
  color: white;
  cursor: default;
  user-select: none;
  justify-content: center;
  min-width: fit-content;
`

const Type = styled.span`
  padding: 0 8px;
  ${(p) => p.theme.typography.labelSmall}
`

type Props = {event: BrimEventInterface; className?: string}

export default function ZeekTag({event, className, ...rest}: Props) {
  return (
    <BG
      className={classNames(className, event.getType() + "-bg-color")}
      {...rest}
    >
      <Type>{event.getType()}</Type>
    </BG>
  )
}

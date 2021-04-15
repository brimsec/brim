import {cssVar} from "polished"
import React from "react"
import styled from "styled-components"

const BG = styled.div`
  height: 18px;
  background: ${(p) => p.color};
  border-radius: 3px;
  display: inline-flex;
  color: white;
  cursor: default;
  user-select: none;
`

const Type = styled.span`
  padding: 0 8px;
  ${(p) => p.theme.typography.labelSmall}
`

const Severity = styled.span`
  height: 18px;
  width: 18px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 8px;
  font-weight: 800;
  text-align: center;
  line-height: 18px;
`

const colors = {
  3: cssVar("--alert-3"),
  2: cssVar("--alert-2"),
  1: cssVar("--alert-1")
}

export default function SuricataTag({event, ...rest}) {
  const num = event.getSeverity()
  return (
    <BG {...rest} color={colors[num]}>
      <Type>alert</Type>
      <Severity>S{num}</Severity>
    </BG>
  )
}

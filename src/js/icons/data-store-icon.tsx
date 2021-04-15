import React from "react"
import SVG from "./data-store-svg"
import styled from "styled-components"

const shadow = "hsla(212, 60%, 6%, 0.42)"

const BG = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(hsl(0, 0%, 100%), hsl(0, 0%, 97%));
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0.5px ${shadow}, 0 0.5px 2px ${shadow};
  svg {
    height: 50%;
    width: 50%;
  }
`

export default function DataStoreIcon() {
  return (
    <BG>
      <SVG />
    </BG>
  )
}

import React from "react"
import styled from "styled-components"

const Wrap = styled.div`
  background: var(--ivory);
  z-index: 1;
  padding: 12px;
  user-select: none;
`

const BorderBottom = styled.div`
  height: 1px;
  box-shadow: inset 0 0.5px 0 0 var(--cloudy);
`

export default function SearchPageHeader({children}) {
  return (
    <>
      <Wrap>{children}</Wrap>
      <BorderBottom />
    </>
  )
}

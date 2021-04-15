import React from "react"
import styled from "styled-components"

import MagnifyingGlass from "../../../icons/magnifying-glass"
import TextInput from "./text-input"

const Wrapper = styled.div`
  position: relative;
  input {
    border-radius: 7px;
    padding-left: 26px;
  }

  svg {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 7px;
    left: 9px;
    fill: var(--slate);
  }
`

export default function SearchInput(props: any) {
  return (
    <Wrapper>
      <MagnifyingGlass />
      <TextInput {...props} />
    </Wrapper>
  )
}

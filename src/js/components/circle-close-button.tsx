import React from "react"
import styled from "styled-components"
import CircleCloseSvg from "../../static/icons/circle-close.svg"

const Wrap = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 16px;
  height: 16px;

  .x {
    fill: white;
    opacity: 0.9;
  }

  &:hover .x {
    opacity: 1;
  }

  .circle {
    fill: white;
    opacity: 0.1;
    transition: opacity 150ms;
  }

  &:hover .circle {
    opacity: 0.2;
  }

  &:active .circle {
    opacity: 0.3;
    transition: none;
  }
`

export function CircleCloseButton({onClick, ...rest}) {
  return (
    <Wrap onClick={onClick} {...rest}>
      <CircleCloseSvg />
    </Wrap>
  )
}

import {darken} from "polished"
import styled from "styled-components"

import {cssVar} from "../../lib/css-var"

const InputAction = styled.button`
  background: none;
  padding: 0;
  border: none;
  position: relative;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  border-radius: 50%;

  svg {
    height: 14px;
    width: 14px;
    fill: var(--lead);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background: rgba(0, 0, 0, 0.08);
    svg {
      fill: ${darken(0.1, cssVar("--lead"))};
    }
  }
`

export default InputAction

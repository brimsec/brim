import {darken} from "polished"
import styled from "styled-components"

import {cssVar} from "../../lib/css-var"

const Button = styled.button`
  background: none;
  padding: 0;
  border: none;
  position: relative;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  border-radius: 50%;

  svg {
    height: 16px;
    width: 16px;
    fill: var(--slate);
  }

  &:not(:disabled) {
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &:active {
      background: rgba(0, 0, 0, 0.08);
      svg {
        fill: ${darken(0.1, cssVar("--slate"))};
      }
    }
  }

  &:disabled svg {
    opacity: 0.24;
  }
`

export default Button

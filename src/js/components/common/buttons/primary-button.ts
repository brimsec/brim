import {darken} from "polished"
import styled from "styled-components"

import {cssVar} from "../../../lib/css-var"

const bg = cssVar("--havelock", "blue")
const bgGradient = darken(0.04, bg)
const bgBorder = darken(0.1, bg)
const bgActive = darken(0.08, bg)

const PrimaryButton = styled.button`
  ${(props) => props.theme.typography.labelNormal};
  color: white;
  background: linear-gradient(${bg}, ${bgGradient});
  border: none;
  border-radius: 4px;
  box-shadow: inset 0 0 0 0.5px ${bgBorder},
    inset 0 1px 0 0 rgba(255, 255, 255, 0.5), 0 0.5px 1px 0 rgba(0, 0, 0, 0.15),
    0 2px 2px 0px rgba(0, 0, 0, 0.1);

  letter-spacing: 0.5px;
  height: 24px;
  padding: 0 18px;
  user-select: none;

  &:active {
    background: ${bgActive};
    box-shadow: none;
  }
`

export default PrimaryButton

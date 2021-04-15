import {cssVar, lighten} from "polished"
import styled from "styled-components"

const lead = cssVar("--lead") as string
const Input = styled.div`
  display: block;
  outline: none;
  border: none;
  padding: 0;
  border-radius: 15px;
  height: 28px;
  line-height: 24px;
  font-size: 13px;
  letter-spacing: 0.8px;
  box-shadow: 0 0 0 0.5px ${lighten(0.1, lead)},
    0 1px 5px 0px rgba(0, 0, 0, 0.08);
  width: 100%;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
`

export default Input

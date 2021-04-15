import styled from "styled-components"

const Label = styled.label`
  ${(p) => p.theme.typography.labelBold};
  color: var(--aqua);
`

export default Label

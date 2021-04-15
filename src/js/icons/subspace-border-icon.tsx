import React, {HTMLProps} from "react"
import styled from "styled-components"

import SubspaceBorderSvg from "../../static/icons/subspace-border.svg"

type Props = HTMLProps<SVGElement>

function Icon(props: Props) {
  return <SubspaceBorderSvg {...props} />
}

const SubspaceBorderIcon = styled(Icon)<Props>`
  fill: var(--aqua);
  .chunk {
    fill: var(--azure);
  }
`

export default SubspaceBorderIcon

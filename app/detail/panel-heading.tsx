import React, {ReactNode} from "react"
import LoadingBurst from "src/js/components/loading-burst"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  margin: 0 4px 12px 4px;
  user-select: none;

  h4 {
    margin: 0;
    ${(p) => p.theme.typography.headingList}
  }

  .burst-1,
  .burst-2 {
    background-color: var(--lead);
  }
`

type Props = {children: ReactNode; isLoading?: boolean}

export default function PanelHeading({children, isLoading}: Props) {
  return (
    <BG>
      <h4>{children}</h4>
      <LoadingBurst show={isLoading} />
    </BG>
  )
}

import React, {memo, ReactNode} from "react"
import InlineTableLoading from "src/js/components/inline-table-loading"
import styled from "styled-components"
import {ChartWrap} from "./Shared"

export const BG = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 1px var(--slate);
`

type Props = {
  isLoading?: boolean
  children: ReactNode
}

export default memo<Props>(function Panel({isLoading, children}: Props) {
  return (
    <BG>
      {isLoading ? (
        <ChartWrap>
          <InlineTableLoading rows={3} />
        </ChartWrap>
      ) : (
        children
      )}
    </BG>
  )
})

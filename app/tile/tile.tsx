import useSearch from "app/core/hooks/useSearch"
import React, {forwardRef} from "react"
import styled from "styled-components"
import MenuButton from "./menu-button"
import Viz from "./viz"
import TableSkeleton from "./table-skeleton"
import {TileFormat} from "ppl/summary/summary"
import useSearchParams from "app/router/hooks/use-search-params"
import useLakeId from "app/router/hooks/use-lake-id"

const BG = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 3px;
  background: white;
  display: flex;
  flex-direction: column;
  text {
    fill: var(--slate);
  }

  .react-resizable-handle {
    // static for now
    opacity: 0;
  }

  .menu-button {
    transition: opacity 100ms;
    opacity: 0;
  }

  &:hover .menu-button {
    opacity: 1;
  }
`

const Title = styled.h2`
  ${(p) => p.theme.typography.headingList}
  font-size: 8px;
  color: var(--slate);
  cursor: default;
  margin: 0;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 6px 18px 12px;
`

type Props = {
  title: string
  query: string
  format: TileFormat
}

function Tile({title, query, format, children, ...rest}, ref) {
  const lakeId = useLakeId()
  const {spanArgs} = useSearchParams()
  const [records, isFetching] = useSearch(query, [lakeId, spanArgs])
  return (
    <div ref={ref} {...rest}>
      <BG>
        <Header>
          <Title>{title}</Title>
          <MenuButton query={query} />
        </Header>
        {isFetching ? (
          <TableSkeleton />
        ) : (
          <Viz format={format} records={records} />
        )}
        {/*  For react-grid-layout to add the resize handle */}
        {children}
      </BG>
    </div>
  )
}

export default forwardRef<HTMLDivElement, Props>(Tile)

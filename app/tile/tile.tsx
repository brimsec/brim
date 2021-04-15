import useSearch from "app/core/hooks/use-search"
import {TileFormat} from "ppl/summary/summary"
import React, {forwardRef} from "react"
import {useSelector} from "react-redux"
import Ingest from "src/js/state/Ingest"
import Tab from "src/js/state/Tab"
import styled from "styled-components"
import MenuButton from "./menu-button"
import TableSkeleton from "./table-skeleton"
import Viz from "./viz"

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
  locationKey: string
}

function Tile({title, query, format, locationKey, children, ...rest}, ref) {
  const span = useSelector(Tab.getSpan)
  const snapshot = useSelector(Ingest.getSnapshot)
  const [records, isFetching] = useSearch(query, [
    JSON.stringify(span),
    locationKey
  ])
  return (
    <div ref={ref} {...rest}>
      <BG>
        <Header>
          <Title>{title}</Title>
          <MenuButton query={query} />
        </Header>
        {isFetching && snapshot === null ? (
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

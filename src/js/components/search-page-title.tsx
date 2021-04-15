import React from "react"
import {useSelector} from "react-redux"
import styled from "styled-components"
import brim from "../brim"
import {formatBytes} from "../lib/bytes"
import Current from "../state/Current"

const Wrap = styled.div``

const Row = styled.div`
  display: flex;
  align-items: center;
`

const TitleRow = styled(Row)`
  margin-bottom: 4px;
`

const StatsRow = styled(Row)``

const Title = styled.h2`
  ${(props) => props.theme.typography.labelBold}
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Stat = styled.span`
  ${(props) => props.theme.typography.headingList}
  color: var(--slate);
  margin-right: 12px;
  white-space: nowrap;
  height: 12px;
`

export default function SearchPageTitle() {
  const space = useSelector(Current.mustGetSpace)
  const {size, name, min_time, max_time} = space
  const bytes = size ? formatBytes(size, 1) : ""
  const span = brim.span([min_time, max_time])
  const duration = span.getDuration() ? span.shortFormat() : ""

  return (
    <Wrap>
      <TitleRow>
        <Title>{name}</Title>
      </TitleRow>
      <StatsRow>
        <Stat>{bytes}</Stat>
        <Stat>{duration}</Stat>
      </StatsRow>
    </Wrap>
  )
}

import {Data, Name, Value} from "app/core/Data"
import useSearch from "app/core/hooks/useSearch"
import Panel from "app/detail/Panel"
import PanelHeading from "app/detail/PanelHeading"
import {Caption, ChartWrap, TableWrap} from "app/detail/Shared"
import {BrimEvent, BrimEventInterface} from "ppl/detail/models/BrimEvent"
import React, {memo, useCallback, useMemo} from "react"
import brim from "src/js/brim"
import {showContextMenu} from "src/js/lib/System"
import zql from "src/js/zql"
import {ZedRecord} from "zealot/zed/data-types"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"

type Props = {
  record: ZedRecord
}

const LIMIT = 100
const getQuery = (r: ZedRecord, limit?: number) => {
  const cid = r.get("community_id")
  const base = zql`_path=conn community_id=${cid} | sort ts`
  return limit ? `${base} | head ${limit}` : base
}

export default memo(function RelatedConns({record}: Props) {
  const [records, isFetching] = useSearch(getQuery(record, LIMIT), [record])
  const events = useMemo(() => records.map(BrimEvent.build), [records])
  const [first, last] = firstLast<BrimEventInterface>(events)
  const data = [
    ["Count", events.length],
    ["First ts", first ? brim.time(first.getTime()).format() : "Not available"],
    ["Last ts", last ? brim.time(last.getTime()).format() : "Not available"],
    ["Duration", formatDur(first?.getTime(), last?.getTime())]
  ]

  const onContextMenu = useCallback(() => {
    showContextMenu([{role: "copy"}])
  }, [])

  return (
    <section>
      <PanelHeading isLoading={isFetching}>Related Connections</PanelHeading>
      <Panel>
        <ChartWrap>
          <EventTimeline events={events} />
          <EventLimit query={getQuery(record)} count={events.length} />
        </ChartWrap>
        <TableWrap>
          {data.map(([name, value]) => (
            <Data key={name}>
              <Name>{name}</Name>
              <Value onContextMenu={onContextMenu}>{value}</Value>
            </Data>
          ))}
        </TableWrap>
      </Panel>
      <Caption>Populated by community_id</Caption>
    </section>
  )
})

import {useSelector} from "react-redux"
import React, {memo, useCallback, useMemo} from "react"

import {reactElementProps} from "src/js/test/integration"
import LogDetails from "src/js/state/LogDetails"
import {zng} from "zealot"
import {Caption, ChartWrap, TableWrap} from "app/detail/Shared"
import PanelHeading from "app/detail/panel-heading"
import EventTimeline from "ppl/detail/event-timeline"
import {BrimEvent} from "ppl/detail/models/brim-event"
import {sort} from "ppl/detail/util/sort"
import {Data, Name, Value} from "app/core/Data"
import formatDur from "ppl/detail/util/format-dur"
import {isEqual} from "lodash"
import Panel from "app/detail/Panel"
import {getCorrelationQuery} from "./flows/get-correlation-query"
import EventLimit from "./event-limit"
import {showContextMenu} from "src/js/lib/System"

export default memo(function UidPanel({record}: {record: zng.Record}) {
  const query = useMemo(() => getCorrelationQuery(record), [record])
  const isLoading = useSelector(LogDetails.getUidStatus) === "FETCHING"
  const logs = useSelector(LogDetails.getUidLogs)

  const events = useMemo(() => {
    return sort(logs).map(BrimEvent.build)
  }, [logs])

  const conn = useMemo(() => {
    return events.find((e) => e.getType() === "conn")
  }, [events])

  const index = useMemo(() => {
    return events.findIndex((e) => isEqual(e.getRecord(), record))
  }, [record, events])

  const onContextMenu = useCallback(() => {
    showContextMenu([{role: "copy"}])
  }, [])

  return (
    <section {...reactElementProps("correlationPanel")}>
      <PanelHeading isLoading={isLoading}>Correlation</PanelHeading>
      <Panel isLoading={isLoading && events.length === 0}>
        <ChartWrap>
          <EventTimeline events={events} current={index} />
          <EventLimit query={query} count={events.length} />
        </ChartWrap>
        <TableWrap>
          <Data>
            <Name>Duration</Name>
            <Value onContextMenu={onContextMenu}>
              {formatDur(conn?.getTime(), conn?.getEndTime())}
            </Value>
          </Data>
        </TableWrap>
      </Panel>
      <Caption>Populated by uid & community_id</Caption>
    </section>
  )
})

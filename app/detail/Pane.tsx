import {BrimEvent} from "ppl/detail/models/brim-event"
import {Correlation} from "ppl/detail/models/Correlation"
import {SuricataEvent} from "ppl/detail/models/suricata-event"
import {ZeekEvent} from "ppl/detail/models/zeek-event"
import RelatedAlerts from "ppl/detail/related-alerts"
import RelatedConns from "ppl/detail/related-conns"
import CorrelationPanel from "ppl/detail/Correlation"
import React, {useLayoutEffect, memo, useMemo, useRef} from "react"
import {useSelector} from "react-redux"
import ConnPanel from "src/js/components/LogDetails/conn-panel"
import {Md5Panel} from "src/js/components/LogDetails/md-5-panel"
import LogDetails from "src/js/state/LogDetails"
import styled from "styled-components"
import {zng} from "zealot"
import Fields from "./Fields"
import NoSelection from "./no-selection"

const BG = styled.div`
  padding: 12px;

  section {
    margin-bottom: 24px;
  }
`

type Props = {
  record: zng.Record
}

const Content = memo<Props>(function Content({record}) {
  const event = useMemo(() => BrimEvent.build(record), [record])
  const isZeek = event instanceof ZeekEvent
  const isSuricata = event instanceof SuricataEvent
  const {uid, cid} = new Correlation(record).getIds()
  const isConn = isZeek && record.try("_path").toString() === "conn"
  const hasMd5 = isZeek && record.has("md5")

  return (
    <BG className="detail-pane-content">
      <div className="column">
        <Fields record={record} />
      </div>
      <div className="column">
        {isZeek && uid && <CorrelationPanel record={record} />}
        {isSuricata && cid && <RelatedAlerts record={record} />}
        {isSuricata && cid && <RelatedConns record={record} />}
        {isConn && <ConnPanel record={record} />}
        {hasMd5 && <Md5Panel record={record} />}
      </div>
    </BG>
  )
})

const Wrap = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

export default function Pane() {
  const record = useSelector(LogDetails.build)
  const ref = useRef<HTMLDivElement>()

  useLayoutEffect(() => {
    const node = ref.current
    if (node) node.scrollTop = 0
  }, [record])

  return (
    <Wrap ref={ref}>
      {record ? <Content record={record} /> : <NoSelection />}
    </Wrap>
  )
}

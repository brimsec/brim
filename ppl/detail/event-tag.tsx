import {SuricataEvent} from "./models/suricata-event"
import React from "react"
import {ZeekEvent} from "./models/zeek-event"
import SuricataTag from "./suricata-tag"
import ZeekTag from "./zeek-tag"

export default function EventTag({event, ...rest}) {
  if (event instanceof ZeekEvent) return <ZeekTag event={event} {...rest} />
  if (event instanceof SuricataEvent)
    return <SuricataTag event={event} {...rest} />
  return null
}

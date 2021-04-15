import {zng} from "zealot"
import {UnknownEvent} from "./unknown-event"
import {SuricataEvent} from "./suricata-event"
import {ZeekEvent} from "./zeek-event"

export interface BrimEventInterface {
  getType: () => string
  getTime: () => Date
  getRecord: () => zng.Record
  getEndTime: () => Date | null
}

export class BrimEvent {
  static build(r: zng.Record) {
    if (r.has("_path")) {
      return new ZeekEvent(r)
    } else if (r.has("event_type")) {
      return new SuricataEvent(r)
    } else {
      return new UnknownEvent(r)
    }
  }
}

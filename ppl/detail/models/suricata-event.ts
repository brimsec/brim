import {zng} from "zealot"
import {BrimEventInterface} from "./brim-event"

export class SuricataEvent implements BrimEventInterface {
  constructor(private r: zng.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return (this.r.get("ts") as zng.Primitive).toDate()
  }

  getEndTime() {
    return null
  }

  getType() {
    return this.r.get("event_type").toString()
  }

  getSeverity(): number {
    const data = this.r.get("alert.severity") as zng.Primitive
    return data.toInt()
  }
}

import {zng} from "zealot"
import {BrimEventInterface} from "./brim-event"

export class UnknownEvent implements BrimEventInterface {
  constructor(private r: zng.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    if (this.r.has("ts")) {
      return (this.r.get("ts") as zng.Primitive).toDate()
    } else {
      return new Date(0)
    }
  }

  getEndTime() {
    return null
  }

  getType() {
    return "unknown"
  }
}

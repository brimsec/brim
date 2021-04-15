import {zng} from "zealot"
import {BrimEventInterface} from "./brim-event"

export class ZeekEvent implements BrimEventInterface {
  constructor(private r: zng.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return (this.r.get("ts") as zng.Primitive).toDate()
  }

  getEndTime() {
    if (this.r.get("_path").toString() !== "conn") return null
    const dur = (this.r.get("duration") as zng.Primitive).toFloat()
    if (!dur) return
    const ts = (this.r.get("ts") as zng.Primitive).toDate()
    return new Date(ts.getTime() + dur * 1000)
  }

  getType() {
    return this.r.get("_path").toString()
  }
}

import brim from "src/js/brim"
import {withCommas} from "src/js/lib/fmt"
import * as zed from "zealot/zed"

export function formatPrimitive(data: zed.Primitive) {
  if (data.isUnset()) return "⦻"
  if (zed.isInt(data)) return withCommas(data.toString())
  if (zed.isTime(data)) return brim.time(this.toDate()).format()
  return data.toString()
}

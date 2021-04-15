import {SearchRecord} from "../types"
import brimSpan from "./span"

export function createSearchEntry(data: SearchRecord) {
  return {
    ...data,
    getDuration() {
      return brimSpan(data.spanArgs).getDuration()
    }
  }
}

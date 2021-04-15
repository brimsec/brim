import {ANALYTIC_MAX_RESULTS} from "../../flows/config"
import {withCommas} from "../../lib/fmt"
import brim from "../../brim"

const EOF = "End of results 🎉"
const TRUNCATED_ANALYTICS = `Showing first ${withCommas(
  ANALYTIC_MAX_RESULTS
)} results`

export default function getEndMessage(program: string, size: number) {
  if (brim.program(program).hasAnalytics() && size === ANALYTIC_MAX_RESULTS) {
    return TRUNCATED_ANALYTICS
  } else {
    return EOF
  }
}

import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {zng} from "zealot"
import {isEqual} from "lodash"
import {fetchCorrelation} from "ppl/detail/flows/fetch"
import Notice from "../state/Notice"
import ErrorFactory from "../models/error-factory"
import Current from "../state/Current"

export const viewLogDetail = (record: zng.Record): Thunk => (
  dispatch,
  getState
) => {
  const current = LogDetails.build(getState())
  if (record && !isEqual(record, current)) {
    dispatch(LogDetails.push(record))

    if (!Current.getSpaceId(getState())) return // It is possible for this code to be called without a space
    dispatch(LogDetails.updateUidStatus("FETCHING"))
    dispatch(fetchCorrelation(record))
      .then((records) => {
        dispatch(LogDetails.updateUidLogs(records))
        dispatch(LogDetails.updateUidStatus("SUCCESS"))
      })
      .catch((e) => dispatch(Notice.set(ErrorFactory.create(e))))
  }
}

import moment from "moment"

import {DateTuple} from "../lib/time-window"
import {Interval} from "../types"

export default function([start, end]: DateTuple): Interval {
  const duration = moment.duration(moment(end).diff(moment(start)))

  if (duration.asMinutes() <= 5)
    return {number: 1, unit: "second", roundingUnit: "second"}

  if (duration.asMinutes() <= 30)
    return {number: 30, unit: "second", roundingUnit: "minute"}

  if (duration.asHours() <= 2)
    return {number: 1, unit: "minute", roundingUnit: "minute"}

  if (duration.asHours() <= 4)
    return {number: 5, unit: "minute", roundingUnit: "hour"}

  if (duration.asHours() <= 12)
    return {number: 15, unit: "minute", roundingUnit: "hour"}

  if (duration.asDays() <= 1)
    return {number: 30, unit: "minute", roundingUnit: "hour"}

  if (duration.asDays() <= 3)
    return {number: 1, unit: "hour", roundingUnit: "hour"}

  if (duration.asDays() <= 14)
    return {number: 6, unit: "hour", roundingUnit: "day"}

  if (duration.asDays() <= 60)
    return {number: 12, unit: "hour", roundingUnit: "day"}

  if (duration.asDays() <= 120)
    return {number: 1, unit: "day", roundingUnit: "day"}

  if (duration.asMonths() <= 12)
    return {number: 7, unit: "day", roundingUnit: "day"}

  return {number: 30, unit: "day", roundingUnit: "day"}
}

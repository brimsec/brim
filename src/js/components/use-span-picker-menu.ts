import {useDispatch, useSelector} from "react-redux"

import {DateTuple, spanOfLast} from "../lib/time-window"
import Current from "../state/Current"
import Search from "../state/Search"
import brim from "../brim"

export default function useSpanPickerMenu(submit: Function) {
  const dispatch = useDispatch()
  const space = useSelector(Current.mustGetSpace)

  function setSpan(span: DateTuple) {
    dispatch(Search.setSpanArgsFromDates(span))
    submit()
  }

  if (!space)
    return [
      {
        click: () => setSpan(spanOfLast(30, "minutes")),
        label: "Last 30 minutes"
      },
      {click: () => setSpan(spanOfLast(24, "hours")), label: "Last 24 hours"},
      {click: () => setSpan(spanOfLast(7, "days")), label: "Last 7 days"},
      {click: () => setSpan(spanOfLast(30, "days")), label: "Last 30 days"}
    ]

  const {min_time, max_time} = space

  const from = brim.time(min_time).toDate()
  const to = brim
    .time(max_time)
    .add(1, "ms")
    .toDate()
  const spaceSpan: DateTuple = [from, to]

  return [
    {click: () => setSpan(spaceSpan), label: "Whole Space"},
    {
      click: () => setSpan(spanOfLast(30, "minutes", to)),
      label: "Last 30 minutes of space"
    },
    {
      click: () => setSpan(spanOfLast(24, "hours", to)),
      label: "Last 24 hours of space"
    },
    {
      click: () => setSpan(spanOfLast(7, "days", to)),
      label: "Last 7 days of space"
    },
    {
      click: () => setSpan(spanOfLast(30, "days", to)),
      label: "Last 30 days of space"
    }
  ]
}

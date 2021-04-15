import {useDispatch, useSelector} from "react-redux"
import React, {useMemo} from "react"
import * as d3 from "d3"

import {DateTuple} from "../../../lib/time-window"
import {Pen, HistogramChart} from "../types"
import {innerHeight, innerWidth} from "../dimens"
import {submitSearch} from "../../../flows/submitSearch/mod"
import Chart from "../../../state/Chart"
import EmptyMessage from "../../empty-message"
import HistogramTooltip from "../../histogram-tooltip"
import LoadingMessage from "../../loading-message"
import barStacks from "../pens/bar-stacks"
import brim from "../../../brim"
import focusBar from "../pens/focus-bar"
import format from "./format"
import hoverLine from "../pens/hover-line"
import reactComponent from "../pens/react-component"
import search from "../../../state/Search"
import tab from "../../../state/Tab"
import time from "../../../brim/time"
import useConst from "../../hooks/use-const"
import xAxisBrush from "../pens/x-axis-brush"
import xAxisTime from "../pens/x-axis-time"
import xPositionTooltip from "../pens/x-position-tooltip"
import yAxisSingleTick from "../pens/y-axis-single-tick"

export default function(width: number, height: number): HistogramChart {
  const chartData = useSelector(Chart.getData)
  const status = useSelector(Chart.getStatus)
  const span = useSelector(tab.getSpanAsDates)
  const innerSpan = useSelector(tab.getSpanFocusAsDates)

  const dispatch = useDispatch()
  const pens = useConst<Pen[]>([], () => {
    function onDragEnd(span: DateTuple) {
      dispatch(search.setSpanArgs(brim.dateTuple(span).toSpan()))
      dispatch(submitSearch())
    }

    function onSelection(span: DateTuple) {
      dispatch(search.setSpanFocus(null))
      dispatch(search.setSpanArgsFromDates(span))
      dispatch(submitSearch())
    }

    function onFocus(dates: DateTuple) {
      dispatch(search.setSpanFocus(time.convertToSpan(dates)))
      dispatch(submitSearch({history: true, investigation: false}))
    }

    function onSelectionClear() {
      dispatch(search.setSpanFocus(null))
      dispatch(submitSearch({history: true, investigation: false}))
    }

    function onSelectionClick(span) {
      dispatch(search.setSpanFocus(null))
      dispatch(search.setSpanArgsFromDates(span))
      dispatch(submitSearch())
    }

    return [
      xAxisTime({onDragEnd}),
      barStacks(),
      yAxisSingleTick(),
      xAxisBrush({onSelection, onSelectionClear, onSelectionClick}),
      hoverLine(),
      reactComponent((chart) => (
        <EmptyMessage show={!chart.state.isFetching && chart.state.isEmpty} />
      )),
      reactComponent((chart) => (
        <LoadingMessage show={chart.state.isFetching} message="Chart Loading" />
      )),
      focusBar({onFocus}),
      xPositionTooltip({
        wrapperClassName: "histogram-tooltip-wrapper",
        render: HistogramTooltip
      })
    ]
  })

  return useMemo<HistogramChart>(() => {
    const data = format(chartData, span)
    const maxY = d3.max(data.points, (d) => d.count) || 0
    const oneCharWidth = 5.5366666667
    const chars = d3.format(",")(maxY).length
    const yAxisWidth = chars * oneCharWidth + 3
    const minWidth = 38
    const margins = {
      left: Math.max(minWidth, yAxisWidth + 8),
      right: 8,
      top: 3,
      bottom: 16
    }

    return {
      data,
      width,
      height,
      margins,
      state: {
        isFetching: status === "FETCHING",
        selection: innerSpan,
        isEmpty: data.points.length === 0,
        isDragging: false
      },
      yScale: d3
        .scaleLinear()
        .range([innerHeight(height, margins), 0])
        .domain([0, maxY]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(width, margins)])
        .domain(span),
      pens
    }
  }, [chartData, status, span, innerSpan, width, height])
}

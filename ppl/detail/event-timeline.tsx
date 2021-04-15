import useContentRect from "app/core/hooks/use-content-rect"
import {scaleTime, extent} from "d3"
import React, {memo, useEffect, useState} from "react"
import styled from "styled-components"
import {BrimEventInterface} from "./models/brim-event"
import EventTag from "./event-tag"
import brim from "src/js/brim"
import {useDispatch} from "react-redux"
import {viewLogDetail} from "src/js/flows/view-log-detail"
import useResizeEffect from "app/core/hooks/use-resize-effect"
import ReactTooltip from "react-tooltip"
import {isEqual} from "lodash"
import useCallbackRef from "src/js/components/hooks/use-callback-ref"

const Lane = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 18px;
  margin-bottom: 3px;
  &:last-of-type {
    margin-bottom: 0px;
  }

  &:hover {
    time {
      display: block;
    }
  }
`

const Axis = styled.div`
  height: 1px;
  background: none;
  box-shadow: 0 0.5px 0 var(--cloudy);
  width: 100%;
`

const Layer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
`

const Tag = styled(EventTag)`
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  &:active {
    box-shadow: none;
  }

  &.current {
    outline: 5px auto -webkit-focus-ring-color;
  }
`

type Props = {
  events: BrimEventInterface[]
  current?: number
}

function getDomain(events) {
  // @ts-ignore extent is poorly typed in d3
  const [start, end]: [Date, Date] = extent(
    events.flatMap((e) => [e.getTime(), e.getEndTime()])
  )
  if (!start) return [undefined, undefined]
  if (isEqual(start, end)) {
    // If they are the same, all the events get put in the middle.
    // Adding 1ms to the end moves them all to the start.
    return [start, new Date(start.getTime() + 1)]
  } else return [start, end]
}

export default memo(function EventTimeline({events, current}: Props) {
  useEffect(() => {
    // This is silly, but ReactTooltip cannot handle this component rerendering
    // with new data. On their docs they have a case for this and suggest this
    // workaround. They also have us hiding all the tooltips manually when this
    // re-renders. Not very "react".
    ReactTooltip.rebuild()
  }, [events])
  const dispatch = useDispatch()
  const [width, setWidth] = useState(0)
  const [lastItem, lastItemRef] = useContentRect()
  const [node, resizeRef] = useCallbackRef()
  useResizeEffect(node, ({width}) => setWidth(width))
  const scale = scaleTime()
    .domain(getDomain(events))
    .range([0, width - lastItem.width])

  const getX = (e) => {
    const start = events.length === 1 ? 0 : scale(e.getTime())
    return {transform: `translateX(${start}px)`}
  }

  const getWidth = (e) => {
    if (e.getEndTime && e.getEndTime()) {
      const start = scale(e.getTime())
      const end = scale(e.getEndTime())
      return {width: end - start}
    } else {
      return undefined
    }
  }

  const onClick = (event: BrimEventInterface) => {
    dispatch(viewLogDetail(event.getRecord()))
  }

  // This is an imprecise way to add padding to the right side of the chart,
  // to prevent the last few items from overflowing. This ensures the last
  // item will not overflow, but does not prevent the second to last item
  // or third to last. In some cases that happens.
  const getRef = (i) =>
    i === events.length - 1 && events.length > 1 ? lastItemRef : undefined

  return (
    <div ref={resizeRef}>
      {events.map((e, i) => (
        <Lane key={i}>
          <Layer>
            <Axis />
          </Layer>
          <Layer>
            <div
              ref={getRef(i)}
              onClick={() => {
                ReactTooltip.hide()
                onClick(e)
              }}
              data-tip={brim.time(e.getTime()).format()}
              data-place="left"
              data-effect="solid"
              data-delay-show={0}
              style={{...getX(e)}}
            >
              <Tag
                event={e}
                style={getWidth(e)}
                className={current === i ? "current" : undefined}
              />
            </div>
          </Layer>
        </Lane>
      ))}
    </div>
  )
})

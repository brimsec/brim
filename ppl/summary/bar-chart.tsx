import React from "react"
import {zng} from "zealot"
import {BarRounded} from "@vx/shape"
import {AxisLeft, AxisBottom} from "@vx/axis"
import {scaleLinear, scaleBand} from "@vx/scale"
import {Group} from "@vx/group"
import {cssVar} from "src/js/lib/css-var"
import styled from "styled-components"

type Props = {
  records: zng.Record[]
  width: number
  height: number
  x: string
  y: string
}

const SVG = styled.svg`
  .vx-bar-rounded {
    transition: all 500ms;
  }
`

export default function BarChart({
  height: outerHeight,
  width: outerWidth,
  x,
  y,
  records
}: Props) {
  const margin = {top: 12, left: 36, right: 0, bottom: 24}
  const width = outerWidth - margin.left - margin.right
  const height = outerHeight - margin.top - margin.bottom
  const data = records.map((r) => ({
    name: r.get(x).toString(),
    count: (r.get(y) as zng.Primitive).toInt()
  }))
  const xScale = scaleBand({
    domain: data.map((d) => d.name),
    range: [0, width],
    padding: 0.4
  })
  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map((d) => d.count))],
    range: [height, 0]
  })

  return (
    <SVG height={outerHeight} width={outerWidth}>
      <Group top={margin.top} left={margin.left}>
        <AxisLeft
          scale={yScale}
          stroke={cssVar("--cloudy")}
          tickStroke={cssVar("--cloudy")}
        />
        <AxisBottom
          scale={xScale}
          top={height}
          stroke={cssVar("--cloudy")}
          tickStroke={cssVar("--cloudy")}
        />
        {data.map((d, i) => {
          const topPoint = yScale(d.count)
          const h = height - topPoint
          const y = topPoint
          const w = xScale.bandwidth()
          const x = xScale(d.name)
          return (
            <BarRounded
              className={`${d.name}-bg-color`}
              key={`bar-${i}`}
              radius={4}
              x={x}
              y={y}
              width={w}
              height={h}
              top={true}
            />
          )
        })}
      </Group>
    </SVG>
  )
}

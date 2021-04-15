import React from "react"

import ChartSVG from "../chart-svg"
import Dimens from "../../Dimens"
import useMainHistogram from "./use-main-histogram"

export default function MainHistogramChart() {
  return (
    <Dimens
      className="chart main-search-histogram"
      render={(rect) => (
        <MainHistogramSvg width={rect.width} height={rect.height} />
      )}
    />
  )
}

type Props = {height: number; width: number}

const MainHistogramSvg = React.memo(function MainHistogramSvg({
  width,
  height
}: Props) {
  const chart = useMainHistogram(width, height)
  return <ChartSVG chart={chart} />
})

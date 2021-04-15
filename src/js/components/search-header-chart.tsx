import {histogramSearch} from "app/search/flows/histogram-search"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useLocation} from "react-router"
import brim from "../brim"
import Url from "../state/Url"
import MainHistogramChart from "./charts/MainHistogram/Chart"

export default function SearchHeaderChart() {
  const location = useLocation()
  const dispatch = useDispatch()
  const {program, pins} = useSelector(Url.getSearchParams)
  const brimProgram = brim.program(program, pins)

  useLayoutEffect(() => {
    dispatch(histogramSearch())
  }, [location.key])

  if (brimProgram.hasAnalytics()) return null
  return (
    <div className="search-page-header-charts">
      <MainHistogramChart />
    </div>
  )
}

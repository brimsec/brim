/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import type {Finding} from "../../state/Investigation/types"
import {RemoveButton} from "../Buttons"
import {globalDispatch} from "../../state/GlobalContext"
import FindingProgram from "./FindingProgram"
import Investigation from "../../state/Investigation"
import Search from "../../state/Search"
import SearchBar from "../../state/SearchBar"
import submitSearch from "../../flows/submitSearch"
import Warning from "../icons/warning-sm.svg"
import Spaces from "../../state/Spaces/selectors"
import {includes} from "lodash"
import Tab from "../../state/Tab"
import Tooltip from "../Tooltip"
import {getTooltipStyle} from "../../lib/MenuStyler"

type Props = {finding: Finding}

export default React.memo<Props>(function FindingCard({finding}: Props) {
  let dispatch = useDispatch()

  function onClick() {
    dispatch(SearchBar.setSearchBarPins(finding.search.pins))
    dispatch(SearchBar.changeSearchBarInput(finding.search.program))
    dispatch(Search.setSpace(finding.search.space))
    dispatch(Search.setSpanArgs(finding.search.spanArgs))
    dispatch(Search.setSpanFocus(null))
    dispatch(submitSearch(false))
  }

  function onRemove() {
    globalDispatch(Investigation.deleteFindingByTs(finding.ts))
  }

  function renderWarning() {
    let [hover, setHover] = useState(false)
    let [tooltipStyle, setTooltipStyle] = useState({})
    let {name, type} = field

    function handleMouseEnter(e) {
      setHover(true)
      setTooltipStyle(getTooltipStyle(e.currentTarget))
    }

    function handleMouseLeave() {
      setHover(false)
    }

    const clusterID = useSelector(Tab.clusterId)
    const spaces = useSelector(Spaces.names(clusterID))
    const body = (
      <div>
        <Warning />
        <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>
      </div>
    )

    if (includes(spaces, finding.search.space)) return body
    return null
  }

  return (
    <div className={classNames("finding-card-wrapper")}>
      <div className="finding-card" onClick={onClick}>
        <FindingProgram search={finding.search} />
        {renderWarning()}
      </div>
      <RemoveButton className="gutter-button-style" onClick={onRemove} />
    </div>
  )
})

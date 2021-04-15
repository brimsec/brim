import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {animated} from "react-spring"
import Workspaces from "src/js/state/Workspaces"
import brim from "../../brim"
import lib from "../../lib"
import Spaces from "../../state/Spaces"
import Tabs from "../../state/Tabs"
import {useResizeObserver} from "../hooks/use-resize-observer"
import AddTab from "./add-tab"
import SearchTab from "./search-tab"
import useTabController from "./use-tab-controller"
import useTabLayout from "./use-tab-layout"

const AnimatedSearchTab = animated(SearchTab)
const MAX_WIDTH = 240

export default function TabBar() {
  const tabs = useSelector(Tabs.getData)
  const spaces = useSelector(Spaces.raw)
  const workspaces = useSelector(Workspaces.raw)
  const count = tabs.length
  const {ref, rect} = useResizeObserver()
  const [width, setWidth] = useState(0)
  const layout = useTabLayout(tabs, width)
  const calcWidth = () =>
    setWidth(lib.bounded(rect.width / count, [0, MAX_WIDTH]))
  const ctl = useTabController(count, calcWidth)

  useEffect(() => calcWidth(), [rect.width])
  return (
    <div className="tab-bar">
      <div className="tabs-container" ref={ref} onMouseLeave={ctl.onMouseLeave}>
        {tabs.map((tab) => (
          <AnimatedSearchTab
            {...layout.dragBinding({
              id: tab.id,
              onDown: () => ctl.onTabClick(tab.id),
              onChange: (indices) => ctl.onTabMove(indices)
            })}
            key={tab.id}
            title={brim.tab(tab, workspaces, spaces).title()}
            style={layout.getStyle(tab.id)}
            removeTab={(e) => ctl.onRemoveClick(e, tab.id)}
            active={tab.id === ctl.activeId}
            isNew={false}
          />
        ))}
        <AddTab onClick={ctl.onAddClick} left={width * count} />
      </div>
    </div>
  )
}

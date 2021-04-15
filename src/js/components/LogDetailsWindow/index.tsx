import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import Current from "../../state/Current"
import HistoryButtons from "../common/history-buttons"
import LogDetails from "../../state/LogDetails"
import DetailPane from "app/detail/Pane"
import usePackets from "app/toolbar/hooks/use-packets"
import ToolbarAction from "app/toolbar/action-button"

export default function LogDetailsWindow() {
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const space = useSelector(Current.mustGetSpace)
  return (
    <div className="log-detail-window">
      <PaneHeader>
        <Left>
          <HistoryButtons
            prevExists={prevExists}
            nextExists={nextExists}
            backFunc={() => dispatch(LogDetails.back())}
            forwardFunc={() => dispatch(LogDetails.forward())}
          />
        </Left>
        <Center>
          <PaneTitle>Log details for space: {space.name}</PaneTitle>
        </Center>
        <Right>
          <PacketsButton />
        </Right>
      </PaneHeader>
      <DetailPane />
    </div>
  )
}

const PacketsButton = () => {
  const packets = usePackets()
  packets.label = undefined
  return (
    <div>
      <ToolbarAction {...packets} />
    </div>
  )
}

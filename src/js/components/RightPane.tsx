import DetailPane from "app/detail/Pane"
import React from "react"
import {connect} from "react-redux"
import {zed} from "zealot"
import {openLogDetailsWindow} from "../flows/openLogDetailsWindow"
import ExpandWindow from "../icons/ExpandWindow"
import dispatchToProps from "../lib/dispatchToProps"
import Current from "../state/Current"
import Layout from "../state/Layout"
import LogDetails from "../state/LogDetails"
import {Pool} from "../state/Pools/types"
import {DispatchProps} from "../state/types"
import AppErrorBoundary from "./AppErrorBoundary"
import CloseButton from "./CloseButton"
import HistoryButtons from "./common/HistoryButtons"
import Pane, {
  Center,
  Left,
  PaneBody,
  PaneHeader,
  PaneTitle,
  Right
} from "./Pane"
import {XRightPaneExpander} from "./RightPaneExpander"

type StateProps = {
  currentLog: zed.Record
  prevExists: boolean
  nextExists: boolean
  isOpen: boolean
  width: number
  pool: Pool
}

type Props = StateProps & DispatchProps

type S = {
  showCollapse: boolean
}

export default class RightPane extends React.Component<Props, S> {
  state = {showCollapse: true}

  onDrag = (e: MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    this.props.dispatch(Layout.setRightSidebarWidth(Math.min(width, max)))
  }

  render() {
    const {prevExists, nextExists, isOpen, width, currentLog} = this.props
    if (!this.props.pool) return null
    if (!isOpen) return <XRightPaneExpander />
    return (
      <Pane
        isOpen={isOpen}
        onDrag={this.onDrag}
        position="right"
        width={width}
        className="log-detail-pane"
        name="Details"
      >
        {currentLog && (
          <PaneHeader>
            <Left>
              <HistoryButtons
                prevExists={prevExists}
                nextExists={nextExists}
                backFunc={() => this.props.dispatch(LogDetails.back())}
                forwardFunc={() => this.props.dispatch(LogDetails.forward())}
              />
            </Left>
            <Center className="log-detail-center">
              <PaneTitle>Log Details</PaneTitle>
              <ExpandWindow
                onClick={() => this.props.dispatch(openLogDetailsWindow())}
                className="panel-button"
              />
            </Center>
            <Right>
              <CloseButton
                className="panel-button close-button"
                onClick={() => this.props.dispatch(Layout.hideRightSidebar())}
              />
            </Right>
          </PaneHeader>
        )}
        <PaneBody>
          <AppErrorBoundary>
            <DetailPane />
          </AppErrorBoundary>
        </PaneBody>
      </Pane>
    )
  }
}

const stateToProps = (state) => {
  return {
    isOpen: Layout.getRightSidebarIsOpen(state),
    width: Layout.getRightSidebarWidth(state),
    prevExists: LogDetails.getHistory(state).canGoBack(),
    nextExists: LogDetails.getHistory(state).canGoForward(),
    currentLog: LogDetails.build(state),
    pool: Current.getPool(state)
  }
}

export const XRightPane = connect(stateToProps, dispatchToProps)(RightPane)

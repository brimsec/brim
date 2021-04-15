import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import {Dispatch} from "../state/types"
import CircleChevron from "./circle-chevron"
import MouseoverWatch from "../lib/mouseover-watch"
import dispatchToProps from "../lib/dispatch-to-props"
import lib from "../lib"
import Layout from "../state/Layout"

type Props = {dispatch: Dispatch}
type State = {show: boolean}

export default class RightPaneExpander extends React.Component<Props, State> {
  watcher = new MouseoverWatch()
  state = {show: false}

  componentDidMount() {
    this.watcher
      .addListener()
      .condition(([x]) => lib.win.getWidth() - x < 36)
      .onEnter(() => this.setState({show: true}))
      .onExit(() => this.setState({show: false}))
      .exitDelay(500)
  }

  componentWillUnmount() {
    this.watcher.removeListener()
  }

  onClick = () => {
    this.props.dispatch(Layout.showRightSidebar())
  }

  render() {
    return ReactDOM.createPortal(
      <CSSTransition
        classNames="slide-in-from-right"
        timeout={{enter: 150, exit: 150}}
        in={this.state.show}
        mountOnEnter
        unmountOnExit
      >
        <div className="right-pane-expand-button" onClick={this.onClick}>
          <CircleChevron left expand light />
        </div>
      </CSSTransition>,
      lib.doc.id("tooltip-root")
    )
  }
}

export const XRightPaneExpander = connect(
  null,
  dispatchToProps
)(RightPaneExpander)

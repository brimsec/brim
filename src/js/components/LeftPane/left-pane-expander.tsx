import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import {Dispatch} from "../../state/types"
import CircleChevron from "../circle-chevron"
import MouseoverWatch from "../../lib/mouseover-watch"
import dispatchToProps from "../../lib/dispatch-to-props"
import lib from "../../lib"
import Layout from "../../state/Layout"

type Props = {dispatch: Dispatch}
type State = {show: boolean}

export default class LeftPaneExpander extends React.Component<Props, State> {
  watcher = new MouseoverWatch()
  state = {show: false}

  componentDidMount() {
    this.watcher
      .addListener()
      .condition(([x]) => x < 36)
      .onEnter(() => this.setState({show: true}))
      .onExit(() => this.setState({show: false}))
      .exitDelay(500)
  }

  componentWillUnmount() {
    this.watcher.removeListener()
  }

  onClick = () => {
    this.props.dispatch(Layout.showLeftSidebar())
  }

  render() {
    return ReactDOM.createPortal(
      <CSSTransition
        classNames="slide-in-from-left"
        timeout={{enter: 150, exit: 150}}
        in={this.state.show}
        mountOnEnter
        unmountOnExit
      >
        <div className="left-pane-expand-button" onClick={this.onClick}>
          <CircleChevron right expand />
        </div>
      </CSSTransition>,
      lib.doc.id("tooltip-root")
    )
  }
}

export const XLeftPaneExpander = connect(
  null,
  dispatchToProps
)(LeftPaneExpander)

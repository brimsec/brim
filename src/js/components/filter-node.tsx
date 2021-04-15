import React, {MouseEvent, FocusEvent} from "react"
import styled from "styled-components"
import {CircleCloseButton} from "./circle-close-button"

type Props = {
  filter: string
  focused?: boolean
  pending?: boolean
  onClick?: (e: MouseEvent) => void
  onRemoveClick?: (e: MouseEvent) => void
  onFocus?: (e: FocusEvent) => void
}

const ButtonWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  .circle {
    color: var(--wet-cement);
  }
`

export default class FilterNode extends React.PureComponent<Props> {
  render() {
    const classNames = ["filter-node"]
    if (this.props.focused) classNames.push("focused")

    return (
      <div className={classNames.join(" ")} onClick={this.props.onClick}>
        <p
          tabIndex={0}
          onFocus={(e) => this.props.onFocus && this.props.onFocus(e)}
        >
          {this.props.filter}
        </p>
        {this.props.onRemoveClick && (
          <ButtonWrap>
            <CircleCloseButton
              onClick={this.props.onRemoveClick}
              className="remove-button"
            />
          </ButtonWrap>
        )}
      </div>
    )
  }
}

import React from "react"
import styled from "styled-components"
import {WorkspaceStatus} from "../../state/WorkspaceStatuses/types"

const StatusLight = ({...props}: any) => {
  return (
    <svg {...props} viewBox="0 0 100 100" width="10">
      <defs>
        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="40" strokeWidth="3" filter="url(#f1)" />
    </svg>
  )
}

export default styled(StatusLight)<{status: WorkspaceStatus}>`
  fill: ${(p) => {
    switch (p.status) {
      case "connected":
        return "var(--green)"
      case "disconnected":
        return "var(--red)"
      default:
        return "var(--lead)"
    }
  }};
`

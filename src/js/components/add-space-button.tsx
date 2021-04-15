import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeImportPath} from "app/router/utils/paths"
import React from "react"
import {useHistory} from "react-router"
import styled from "styled-components"

const StyledAnchor = styled.a`
  margin-left: auto;
  margin-right: 8px;
  background: rgba(0, 0, 0, 0);
  width: 24px;
  height: 18px;
  border-radius: 3px;
  text-align: center;
  line-height: 16px;
  font-weight: 300;
  font-size: 18px;
  color: var(--slate);
  ${(props) => props.theme.hoverQuiet}
`

export default function AddSpaceButton() {
  const history = useHistory()
  const workspaceId = useWorkspaceId()
  const onClick = () => history.push(lakeImportPath(workspaceId))

  return (
    <StyledAnchor className="add-space" onClick={onClick}>
      +
    </StyledAnchor>
  )
}

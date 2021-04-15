import {workspacePath} from "app/router/utils/paths"
import React from "react"
import {useSelector} from "react-redux"
import {useHistory} from "react-router"
import {BrimWorkspace} from "src/js/brim"
import workspace from "src/js/brim/workspace"
import DataStoreIcon from "src/js/icons/data-store-icon"
import Workspaces from "src/js/state/Workspaces"
import styled from "styled-components"

const StyledWorkspace = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px;
  border-radius: 3px;
  min-width: 250px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const WorkspaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  margin: 0 12px;
`
const WorkspaceName = styled.div`
  ${(p) => p.theme.typography.labelBold};
  color: var(--aqua);
  cursor: default;
`
const WorkspaceAddress = styled.div`
  ${(p) => p.theme.typography.labelSmall};
  color: var(--slate);
  cursor: default;
`

type Props = {
  workspace: BrimWorkspace
  onClick: () => void
}

const Workspace = ({workspace, onClick}: Props) => {
  return (
    <StyledWorkspace onClick={onClick}>
      <DataStoreIcon />
      <WorkspaceInfo>
        <WorkspaceName>{workspace.name}</WorkspaceName>
        <WorkspaceAddress>{workspace.getAddress()}</WorkspaceAddress>
      </WorkspaceInfo>
    </StyledWorkspace>
  )
}

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: scroll;
`

const StyledHeader = styled.h1`
  margin: 96px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const WorkspacesWrapper = styled.ul`
  padding: 0;
`

const WorkspacesList = () => {
  const workspaces = useSelector(Workspaces.all)
  const history = useHistory()
  return (
    <PageWrap>
      <StyledHeader>Choose a Workspace</StyledHeader>
      <WorkspacesWrapper>
        {workspaces.map((w) => (
          <Workspace
            key={w.id}
            workspace={workspace(w)}
            onClick={() => history.push(workspacePath(w.id))}
          />
        ))}
      </WorkspacesWrapper>
    </PageWrap>
  )
}

export default WorkspacesList

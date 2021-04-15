import React, {useState} from "react"

import MacSpinner from "./mac-spinner"
import styled from "styled-components"
import ToolbarButton from "../../../app/toolbar/button"
import {useDispatch} from "react-redux"
import {initCurrentTab} from "../flows/init-current-tab"
import {Workspace} from "../state/Workspaces/types"

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const StyledHeader = styled.h1`
  margin: 110px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const StyledP = styled.p`
  margin: 18px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.labelNormal}
`

const StyledButton = styled(ToolbarButton)`
  margin: 36px 0 0 0;
`

type Props = {
  workspace: Workspace
}

const ConnectionError = ({workspace}: Props) => {
  const dispatch = useDispatch()
  const [isFetching, setIsFetching] = useState(false)

  const onClick = async () => {
    setIsFetching(true)
    // add wait here so ui feedback is more visible to user
    await new Promise((res) => setTimeout(res, 500))
    await dispatch(initCurrentTab())
    setIsFetching(false)
  }

  const {host, port} = workspace
  const errorMsg = isFetching
    ? "Attempting to connect..."
    : `The service at ${host}:${port} could not be reached.`

  return (
    <PageWrap>
      <StyledHeader>Connection Error</StyledHeader>
      <StyledP>{errorMsg}</StyledP>
      <StyledButton
        onClick={onClick}
        text={isFetching ? "" : "Retry"}
        icon={isFetching ? <MacSpinner /> : null}
      />
    </PageWrap>
  )
}

export default ConnectionError

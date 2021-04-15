import React from "react"
import styled from "styled-components"
import {remote} from "electron"
import Link from "./common/Link"
import ToolbarButton from "../../../app/toolbar/button"

const Wrap = styled.div`
  padding: 24px;
  padding-top: 54px;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8eee3, #fae1e0);
`

const WindowDragArea = styled.div`
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height 30px;
  background-color: rgba(0,0,0,0.05);
`

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
`

const Pre = styled.pre`
  font-size: 10px;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 12px 18px;
  margin-bottom: 24px;
  border-radius: 8px;
`

const Title = styled.h1`
  font-size: 13px;
  font-weight: 600;
  color: var(--red);
  margin-bottom: 12px;
  user-select: none;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  a {
    font-size: 11px;
    color: var(--havelock);
    margin-right: 24px;
  }
`

const StyledLink = styled(Link)`
  outline: 1px solid orange;
`

type Props = {
  error: object
}

function format(e) {
  if (e instanceof Error) {
    return e.stack
  } else {
    return JSON.stringify(e, null, 2)
  }
}

export default function StartupError({error}: Props) {
  const e = format(error)

  function onClick() {
    remote.app.relaunch()
    remote.app.exit(0)
  }

  return (
    <Wrap>
      <WindowDragArea />
      <Content>
        <Title>Brim Failed to Start</Title>
        <Pre>{e}</Pre>
        <Actions>
          <StyledLink href="mailto:support@brimsecurity.com">
            Contact Support
          </StyledLink>
          <ToolbarButton text="Relaunch" onClick={onClick} />
        </Actions>
      </Content>
    </Wrap>
  )
}

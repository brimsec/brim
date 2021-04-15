import React from "react"
import styled from "styled-components"

import Back from "../icons/back-arrow.svg"
import Button from "./Button"
import Forward from "../icons/forward-arrow.svg"
import {useHistory} from "react-router"

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function HistoryArrows() {
  const history = useHistory()
  // @ts-ignore history definitely has an index
  const canGoBack = history.index > 0
  // @ts-ignore history definitely has an index
  const canGoForward = history.length - 1 != history.index
  const back = () => history.goBack()
  const forward = () => history.goForward()

  return (
    <Wrap>
      <Button disabled={!canGoBack} onClick={back}>
        <Back />
      </Button>
      <Button disabled={!canGoForward} onClick={forward}>
        <Forward />
      </Button>
    </Wrap>
  )
}

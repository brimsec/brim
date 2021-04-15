import React from "react"
import styled from "styled-components"

import Pins from "./Pins"
import Error from "./Error"
import HistoryArrows from "./history-arrows"
import Input from "./Input"
import InputBackdrop from "./input-backdrop"
import MenuAction from "./menu-action"
import PinAction from "./pin-action"
import Spinner from "./Spinner"
import SubmitButton from "./submit-button"
import SaveAction from "./save-action"

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  -webkit-app-region: no-drag;
  margin-bottom: 12px;

  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const Group = styled.div<{flex: number}>`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
`

const InputActions = styled.div`
  display: flex;
  margin-right: 8px;
`

export function SearchBar() {
  return (
    <Wrap className="search-bar">
      <HistoryArrows />
      <Group flex={1}>
        <InputBackdrop>
          {/* Disabling target select for now to force search by events and disallow index searches */}
          {/*<TargetSelect />*/}
          <Input />
          <Spinner />
          <InputActions>
            <SaveAction />
            <PinAction />
            <MenuAction />
          </InputActions>
          <SubmitButton />
        </InputBackdrop>
        <Error />
        <Pins />
      </Group>
    </Wrap>
  )
}

import React from "react"
import {useSelector} from "react-redux"
import SystemTest from "src/js/state/SystemTest"
import {hookLogLocator} from "src/js/test/locators"
import styled from "styled-components"

const BG = styled.ol`
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  margin: 0;
  padding: 0.5em 1em 0.5em 2em;
  border-radius: 2px;
  font-size: 11px;
  pointer-events: none;

  li {
    margin: 3px 0;
    padding: 0;
  }
`

export default function HookLog() {
  const hooks = useSelector(SystemTest.getHooks)

  return (
    <BG>
      {hooks.map((m, i) => (
        <li {...hookLogLocator.props} key={i}>
          {m}
        </li>
      ))}
    </BG>
  )
}

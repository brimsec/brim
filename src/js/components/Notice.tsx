import {cssVar, transparentize} from "polished"
import React, {useState, useEffect} from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
import styled from "styled-components"
import doc from "../lib/doc"
import {CircleCloseButton} from "./circle-close-button"

const Wrap = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  height: 112px;
`

const bg = cssVar("--wet-cement") as string
const shadow = transparentize(0.65, bg)

const Content = styled.div<{timeout: {appear: number; exit: number}}>`
  pointer-events: all;
  white-space: nowrap;
  user-select: none;
  background: var(--wet-cement);
  border-radius: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px 3px ${shadow};

  button {
    display: block;
    margin-right: 8px;
  }

  --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);

  &.notice-appear {
    transform: translateY(100px);
  }

  &.notice-appear-active {
    transition: transform ${(p) => p.timeout.appear}ms var(--ease-out-expo);
    transform: translateY(0px);
  }

  &.notice-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.notice-exit-active {
    opacity: 0;
    transform: scale(0);
    transition: all ${(p) => p.timeout.exit}ms var(--ease-in-expo);
  }

  &.notice-exit-done {
    opacity: 0;
  }
`

const Message = styled.p`
  ${(p) => p.theme.typography.labelNormal}
  margin: 0;
  color: white;
  padding: 0 16px;
`

type Props = {
  text: string
  onDone?: () => void
}

export function Notice({text, onDone, ...rest}: Props) {
  const [visible, setVisible] = useState(true)
  const appear = 500
  const exit = 350
  const duration = 3000

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), duration + appear)
    return () => {
      clearTimeout(id)
    }
  }, [])

  return ReactDOM.createPortal(
    <Wrap>
      <CSSTransition
        in={visible}
        appear
        classNames="notice"
        timeout={{appear, exit}}
        onExited={onDone}
      >
        <Content timeout={{appear, exit}} {...rest}>
          <Message>{text}</Message>
          <CircleCloseButton onClick={() => setVisible(false)} />
        </Content>
      </CSSTransition>
    </Wrap>,
    doc.id("tooltip-root")
  )
}

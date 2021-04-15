import React, {useState} from "react"
import ReactDOM from "react-dom"
import {useDispatch} from "react-redux"
import {CSSTransition} from "react-transition-group"
import SystemTest from "src/js/state/SystemTest"
import styled from "styled-components"
import doc from "../../lib/doc"
import useEscapeKey from "../hooks/use-escape-key"
import {useFreezeBody} from "../hooks/use-freeze-body"

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding-top: 42px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
  overflow: hidden;
`

const Background = styled.div`
  pointer-events: all;
  display: flex;
  overflow: hidden;
  min-height: 100px;
  min-width: 300px;
  max-width: 80%;
  max-height: 80%;
  background: var(--cloudy);
  box-shadow: 0 0 1px hsla(28, 5%, 20%, 0.75),
    0 12px 45px hsla(28, 5%, 20%, 0.6);
  border-radius: 0 0 2px 2px;
  opacity: 1;

  &.appear {
    transform: translateY(-100%);
  }

  &.appear-active {
    transition: all 300ms ease-out;
    transform: translateY(0%);
  }

  &.exit {
    transform: translateY(0);
  }

  &.exit-active {
    transition: transform 300ms;
    transform: translateY(-100%);
  }

  &.exit-done {
    display: none;
  }
`

export const Content = styled.div<{width?: number}>`
  ${(p) => p.theme.typography.labelNormal}
  min-height: 0;
  min-width: 100%;
  width: ${(p) => (p.width && p.width + "px") || "100%"};
  display: flex;
  flex-direction: column;
  padding-top: 18px;
  & > * {
    padding-left: 12px;
    padding-right: 12px;
  }
`

export const Title = styled.h2`
  ${(p) => p.theme.typography.headingPage}
  margin-bottom: 12px;
`

export const SmallTitle = styled.h2`
  ${(p) => p.theme.typography.headingList}
  margin-bottom: 24px;
`

export const Scrollable = styled.div`
  overflow: auto;
`

export const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row-reverse;
  padding: 6px 12px;
`

export const Pre = styled.pre`
  font-size: 11px;
  overflow-x: visible;
  overflow-y: visible;
  padding: 12px 24px;
`

export const ButtonGroup = styled.div`
  display: flex;
  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0px;
    }
  }
`

interface ChildProps {
  onClose: () => any
}

type Props = {
  children: (props: ChildProps) => any
  onClosed: () => any
}

export function ModalDialog(props: Props) {
  const dispatch = useDispatch()
  const [show, setShow] = useState(true)
  const onClose = () => setShow(false)

  useFreezeBody(show)
  useEscapeKey(onClose)

  return ReactDOM.createPortal(
    <Overlay>
      <CSSTransition
        in={show}
        appear
        classNames=""
        timeout={310}
        onExited={() => setTimeout(props.onClosed, 100)}
        onEntering={() => dispatch(SystemTest.hook("modal-entering"))}
        onEntered={() => dispatch(SystemTest.hook("modal-entered"))}
      >
        <Background>{props.children({onClose})}</Background>
      </CSSTransition>
    </Overlay>,
    doc.id("modal-dialog-root")
  )
}

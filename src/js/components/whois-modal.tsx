import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import modal from "../state/Modal"
import whois from "../services/whois"
import {
  Content,
  Footer,
  Pre,
  Scrollable,
  Title
} from "./ModalDialog/modal-dialog"
import ToolbarButton from "../../../app/toolbar/button"
import useEnterKey from "./hooks/use-enter-key"

export default function WhoisModal({onClose}) {
  useEnterKey(onClose)
  const [text, setText] = useState("...Fetching...")
  const {addr} = useSelector(modal.getArgs)

  useEffect(() => {
    setTimeout(() => {
      whois(addr)
        .then(setText)
        .catch(setText)
    }, 250)
  }, [])

  return (
    <Content width={600}>
      <Title>Whois Lookup</Title>
      <span>{addr}</span>
      <Scrollable>
        <Pre>{text}</Pre>
      </Scrollable>
      <Footer>
        <ToolbarButton text="Done" onClick={onClose} />
      </Footer>
    </Content>
  )
}

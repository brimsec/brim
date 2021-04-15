import {useDispatch} from "react-redux"
import React from "react"

import {inspectSearch} from "../flows/inspect-search"
import {reactElementProps} from "../test/integration"
import clickFeedback from "./click-feedback"
import lib from "../lib"
import {AppDispatch} from "../state/types"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title
} from "./ModalDialog/modal-dialog"
import ToolbarButton from "../../../app/toolbar/button"
import useEnterKey from "./hooks/use-enter-key"

export default function CurlModalBox({onClose}) {
  useEnterKey(onClose)
  const dispatch = useDispatch<AppDispatch>()
  const {search, host, program} = dispatch(inspectSearch())

  function copyToClip(e) {
    clickFeedback(e.target, "Copied")
    const node = document.getElementById("copy-to-curl-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  return (
    <Content width={600} {...reactElementProps("curlModal")}>
      <Title>Curl Command</Title>
      <Scrollable>
        {search && (
          <Pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
            curl -X {search.method} -d &apos;
            {JSON.stringify(JSON.parse(search.body), null, 2)}
            &apos; http://{host}
            {search.path}
          </Pre>
        )}
        {!search && (
          <Pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
            Invalid ZQL: &apos;{program}&apos;
          </Pre>
        )}
      </Scrollable>
      <Footer>
        <ButtonGroup>
          <ToolbarButton text="Copy" onClick={copyToClip} />
          <ToolbarButton text="Done" onClick={onClose} />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}

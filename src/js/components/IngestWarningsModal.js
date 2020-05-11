/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {globalDispatch} from "../state/GlobalContext"
import ModalBox from "./ModalBox/ModalBox"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import TextContent from "./TextContent"

export default function IngestWarningsModal() {
  let id = useSelector(Tab.clusterId)
  let spaceID = useSelector(Tab.spaceID)
  let warnings = useSelector(Spaces.getIngestWarnings(id, spaceID))

  let buttons = [{label: "Done", click: (done) => done()}]
  if (warnings.length) {
    buttons.unshift({
      label: "Clear Warnings",
      click: () => globalDispatch(Spaces.clearIngestWarnings(id, spaceID))
    })
  }

  return (
    <ModalBox
      name="ingest-warnings"
      className="ingest-warnings-modal"
      title="Ingest Warnings"
      buttons={buttons}
    >
      <TextContent>
        {warnings.length ? (
          <pre className="output">{warnings.join("\n")}</pre>
        ) : (
          <p>Warnings cleared.</p>
        )}
      </TextContent>
    </ModalBox>
  )
}

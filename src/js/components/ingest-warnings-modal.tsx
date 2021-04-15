import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {JSON_TYPE_CONFIG_DOCS} from "./Preferences/json-type-config"
import Current from "../state/Current"
import Link from "./common/Link"
import Spaces from "../state/Spaces"
import useEnterKey from "./hooks/use-enter-key"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title
} from "./ModalDialog/modal-dialog"
import ToolbarButton from "../../../app/toolbar/button"

export default function IngestWarningsModal({onClose}) {
  const dispatch = useDispatch()
  useEnterKey(onClose)
  const id = useSelector(Current.getWorkspaceId)
  const spaceId = useSelector(Current.getSpaceId)
  const warnings = useSelector(Spaces.getIngestWarnings(id, spaceId))
  const onClear = () => dispatch(Spaces.clearIngestWarnings(id, spaceId))

  return (
    <Content width={800}>
      <Title>Ingest Warnings</Title>
      {warnings.length ? (
        <>
          <p>
            {
              "The data you've attempt to import was not recognized as any supported packet capture or log format. The errors returned by each log parser:"
            }
          </p>
          <Scrollable>
            <Pre>{warnings.join("\n")}</Pre>
          </Scrollable>
          <p>
            If you are trying to import JSON logs, please review the{" "}
            <Link href={JSON_TYPE_CONFIG_DOCS}>
              JSON type configuration docs.
            </Link>
          </p>
        </>
      ) : (
        <p>Warnings cleared.</p>
      )}
      <Footer>
        <ButtonGroup>
          {warnings.length > 0 && (
            <ToolbarButton text="Clear Warnings" onClick={onClear} />
          )}
          <ToolbarButton text="Done" onClick={onClose} />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}

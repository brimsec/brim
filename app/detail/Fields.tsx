import {Data, Name, Value} from "app/core/Data"
import {typeClassNames} from "app/core/utils/type-class-names"
import React, {memo, useCallback, useMemo, useState} from "react"
import {useDispatch} from "react-redux"
import {createCell} from "src/js/brim/cell"
import BrimTooltip from "src/js/components/BrimTooltip"
import ColumnDescription from "src/js/components/LogDetails/ColumnDescription"
import {ZedField, ZedRecord} from "zealot/zed"
import contextMenu from "./flows/contextMenu"
import Panel from "./Panel"
import PanelHeading from "./PanelHeading"

type Props = {
  record: ZedRecord
}

type DTProps = {
  fields: ZedField[]
  onRightClick: (f: ZedField) => void
  onHover: (f: ZedField) => void
}

const DataPanel = React.memo<DTProps>(function DataTable({
  fields,
  onRightClick,
  onHover
}: DTProps) {
  return (
    <Panel>
      {fields.map((field, index) => (
        <Data key={index} onMouseEnter={() => onHover(field)}>
          <Name>
            <TooltipAnchor>{field.name}</TooltipAnchor>
          </Name>
          <Value
            className={typeClassNames(field.data)}
            onContextMenu={() => onRightClick(field)}
          >
            {createCell(field).display()}
          </Value>
        </Data>
      ))}
    </Panel>
  )
})

function TooltipAnchor({children}) {
  return (
    <span
      data-tip="column-description"
      data-for="column-description"
      data-place="left"
      data-effect="solid"
      data-delay-show={500}
    >
      {children}
    </span>
  )
}

function Tooltip({field, record}) {
  return (
    <BrimTooltip id="column-description" className="brim-tooltip-show-hover">
      <ColumnDescription
        column={field}
        path={record.try("_path")?.toString()}
      />
    </BrimTooltip>
  )
}

export default memo(function Fields({record}: Props) {
  const dispatch = useDispatch()
  const [hovered, setHovered] = useState({name: "", type: ""})

  const onHover = useCallback((field) => {
    setHovered(field)
  }, [])

  const onRightClick = useCallback(
    (field) => dispatch(contextMenu(field, record)),
    [record]
  )

  const fields = useMemo(() => {
    if (!record) return []
    else return record.flatten().fields
  }, [record])

  return (
    <section>
      <PanelHeading>Fields</PanelHeading>
      <DataPanel
        fields={fields}
        onRightClick={onRightClick}
        onHover={onHover}
      />
      <Tooltip field={hovered} record={record} />
    </section>
  )
})

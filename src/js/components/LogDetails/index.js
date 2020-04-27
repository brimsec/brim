/* @flow */

import {useSelector} from "react-redux"
import React, {useState} from "react"

import {Md5Panel} from "./Md5Panel"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import LogDetails from "../../state/LogDetails"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"
import menu from "../../electron/menu"
import useDebouncedEffect from "../hooks/useDebouncedEffect"

export default function LogDetailComponent() {
  let currentLog = useSelector(LogDetails.build)
  let isGoingBack = useSelector(LogDetails.getIsGoingBack)

  let [log, setLog] = useState(currentLog)

  useDebouncedEffect(() => setLog(currentLog), 50, [currentLog])

  if (!log) return <NoSelection />

  return (
    <NavAnimation log={log} prev={isGoingBack}>
      <div className="log-detail">
        <FieldsPanel log={log} contextMenu={menu.searchFieldContextMenu} />
        {log.correlationId() && <UidPanel log={log} />}
        <ConnPanel log={log} contextMenu={menu.searchFieldContextMenu} />
        {log.getString("md5") && (
          <Md5Panel log={log} contextMenu={menu.searchFieldContextMenu} />
        )}
      </div>
    </NavAnimation>
  )
}

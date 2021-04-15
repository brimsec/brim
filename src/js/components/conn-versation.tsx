import {every} from "lodash"
import {useDispatch} from "react-redux"
import React from "react"

import {Fieldset} from "./Typography"
import VerticalTable from "./Tables/vertical-table"
import connHistoryView from "../lib/conn-history-view"
import {zng} from "zealot"
import contextMenu from "app/detail/flows/context-menu"

const ORIG_FIELDS = ["orig_bytes", "orig_pkts", "orig_ip_bytes", "local_orig"]
const RESP_FIELDS = ["resp_bytes", "resp_pkts", "resp_ip_bytes", "local_resp"]

type Props = {
  record: zng.Record
}

function filter(record: zng.Record, names: string[]) {
  const cols = []
  const vals = []

  names.forEach((n) => {
    const i = record.getColumnNames().indexOf(n)
    cols.push(record.type[i])
    vals.push(record.value[i])
  })

  return new zng.Record(cols, vals)
}

const ConnVersation = ({record}: Props) => {
  return (
    <div className="conn-versation">
      <Host
        title="Originator"
        className="originator"
        record={filter(record, ORIG_FIELDS)}
        ip={record.getField("id.orig_h")}
        port={record.getField("id.orig_p")}
      />
      <ConnHistory history={record.get("history").toString()} />
      <Host
        title="Responder"
        className="responder"
        record={filter(record, RESP_FIELDS)}
        ip={record.getField("id.resp_h")}
        port={record.getField("id.resp_p")}
      />
    </div>
  )
}

const ConnHistory = ({history = ""}) => (
  <div className="history">
    {connHistoryView(history).map((view, i) => (
      <div key={i} className={`history-packet arrow-${view.direction}`}>
        <span>{view.text}</span>
        <hr />
        <svg className="triangle" viewBox="0 0 18 12">
          <polygon points="18 6 0 12 2.66453526e-15 0" />
        </svg>
      </div>
    ))}
  </div>
)

type HostProps = {
  className: string
  title: string
  ip: zng.Field
  port: zng.Field
  record: zng.Record
}

const Host = ({className, title, ip, port, record}: HostProps) => {
  const dispatch = useDispatch()
  if (!ip) return null
  if (!port) return null

  function onRightClick(field, record) {
    dispatch(contextMenu(field, record))
  }

  return (
    <div className={`host ${className}`}>
      <Fieldset>{title}</Fieldset>
      <p
        onContextMenu={() => onRightClick(ip, record)}
        className={`ip ${ip.data.toString().length > 16 ? "small" : ""}`}
      >
        {ip.data.toString()}
      </p>
      <p onContextMenu={() => onRightClick(port, record)} className="port">
        {port.data.toString()}
      </p>
      <VerticalTable
        descriptor={record.type}
        record={record}
        onRightClick={onRightClick}
      />
    </div>
  )
}

ConnVersation.shouldShow = (record: zng.Record) =>
  every(ORIG_FIELDS, (name) => record.has(name))

export default ConnVersation

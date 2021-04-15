import {useDispatch} from "react-redux"
import React, {useEffect, useState} from "react"

import {md5Search} from "../../../../app/search/flows/md-5-search"
import HorizontalTable from "../Tables/horizontal-table"
import InlineTableLoading from "../inline-table-loading"
import {AppDispatch} from "src/js/state/types"
import {zng} from "zealot"
import PanelHeading from "app/detail/panel-heading"
import contextMenu from "app/detail/flows/context-menu"

type Props = {
  record: zng.Record
}

export const Md5Panel = ({record}: Props) => {
  const logMd5 = record.get("md5").toString()
  const dispatch = useDispatch<AppDispatch>()
  const [tx, setTx] = useState([])
  const [rx, setRx] = useState([])
  const [md5, setMd5] = useState([])
  const [filenames, setFilenames] = useState([])
  const [status, setStatus] = useState("INIT")

  useEffect(() => {
    const {response, abort} = dispatch(md5Search(logMd5))
    response
      .status(setStatus)
      .chan(0, (records) => setFilenames(records))
      .chan(1, (records) => setMd5(records))
      .chan(2, (records) => setRx(records))
      .chan(3, (records) => setTx(records))

    return abort
  }, [logMd5])

  function onRightClick(field, record) {
    dispatch(contextMenu(field, record))
  }

  return (
    <section className="hash-correlation detail-panel">
      <PanelHeading isLoading={status === "FETCHING"}>
        Md5 Correlation
      </PanelHeading>
      <AsyncTable logs={md5} onRightClick={onRightClick} expect={1} />
      <AsyncTable logs={filenames} onRightClick={onRightClick} expect={1} />
      <div className="two-column">
        <AsyncTable logs={tx} onRightClick={onRightClick} expect={5} />
        <AsyncTable logs={rx} onRightClick={onRightClick} expect={5} />
      </div>
    </section>
  )
}

type Props2 = {
  logs: zng.Record[]
  expect: number
  onRightClick?: (f: zng.Field, r: zng.Record) => void
}

function AsyncTable({logs, expect, onRightClick}: Props2) {
  if (logs.length === 0) {
    return <InlineTableLoading rows={expect} />
  } else {
    return (
      <HorizontalTable
        descriptor={logs[0].getColumns()}
        logs={logs}
        onRightClick={onRightClick}
      />
    )
  }
}

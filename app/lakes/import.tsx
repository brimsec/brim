import {useDispatch} from "react-redux"
import React from "react"

import ErrorFactory from "../../src/js/models/error-factory"
import Link from "../../src/js/components/common/Link"
import LoadFilesInput from "ppl/import/load-files-input"
import Notice from "../../src/js/state/Notice"
import errors from "../../src/js/errors"
import ingestFiles from "../../src/js/flows/ingest-files"
import refreshSpaceNames from "../../src/js/flows/refresh-space-names"
import {AppDispatch} from "../../src/js/state/types"
import {popNotice} from "../../src/js/components/pop-notice"

export default function TabImport() {
  const dispatch = useDispatch<AppDispatch>()

  function onChange(_e, files) {
    if (!files.length) return
    dispatch(ingestFiles(files))
      .then(() => {
        popNotice("Import complete.")
      })
      .catch((e) => {
        const regex = /(Failed to fetch)|(network error)/
        regex.test(e.cause.message)
          ? dispatch(Notice.set(errors.importInterrupt()))
          : dispatch(Notice.set(ErrorFactory.create(e.cause)))

        dispatch(refreshSpaceNames())
        console.error(e.message)
      })
  }

  return (
    <div className="input-methods">
      <section>
        <h2>Import Files</h2>
        <LoadFilesInput onChange={onChange} />
        <footer>
          <p>
            <b>Accepted formats:</b> .csv, .json, .parquet, .tsv,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zng.md">
              .zng
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zson.md">
              .zson
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zst.md">
              .zst
            </Link>
          </p>
        </footer>
      </section>
    </div>
  )
}

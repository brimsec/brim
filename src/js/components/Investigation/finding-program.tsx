import {isEmpty} from "lodash"
import React from "react"

import {SearchRecord} from "../../types"

type Props = {search: SearchRecord}

export default function FindingProgram({search}: Props) {
  if (isEmpty(search.pins) && isEmpty(search.program))
    return (
      <div className="program">
        <p>*</p>
      </div>
    )

  return (
    <div className="program">
      {search.pins.map((text, i) => (
        <p className="pin" key={i}>
          {text}
        </p>
      ))}
      <p>{search.program}</p>
    </div>
  )
}

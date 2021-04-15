import React from "react"

import InfoNotice from "./info-notice"
import XButton from "./x-button"

type Props = {onClick: Function}

export default function IngestUpdateNotice({onClick}: Props) {
  return (
    <InfoNotice>
      <p>More data is now available.</p>
      <p>
        <button className="bevel-button" onClick={() => onClick(0)}>
          Refresh
        </button>
      </p>
      <XButton onClick={() => onClick(1)} />
    </InfoNotice>
  )
}

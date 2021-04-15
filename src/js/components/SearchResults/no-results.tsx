import React from "react"

type Props = {width: number}

export default function NoResults({width}: Props) {
  return (
    <div className="no-results" style={{width}}>
      <p>No Result Data</p>
    </div>
  )
}

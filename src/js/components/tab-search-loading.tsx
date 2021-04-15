import React from "react"

import MacSpinner from "./mac-spinner"

export default function TabSearchLoading() {
  return (
    <div className="tab-search-loading">
      <div className="message">
        <p>Waiting for space to become queryable...</p>
        <MacSpinner />
      </div>
    </div>
  )
}

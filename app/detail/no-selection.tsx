import React from "react"

const NoSelection = () => (
  <div className="empty-message-wrapper">
    <div className="empty-message">
      <h3>No Log Selected</h3>
      <p>Click a log line to view details.</p>
      <p>
        Toggle this pane with <code>Cmd + ]</code>.
      </p>
    </div>
  </div>
)

export default NoSelection

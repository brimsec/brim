import React from "react"

type Props = {
  rows: number
}

const InlineTableLoading = ({rows}: Props) => {
  return (
    <div className="inline-table inline-table-loading">
      <table>
        <tbody>
          {Array(rows)
            .fill(0)
            .map((_, index) => (
              <tr key={index}>
                <td />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default InlineTableLoading

import {BrimError} from "./types"

export default function(err: string): BrimError {
  return {
    type: "LogsIngestError",
    message: "Unable to load these logs",
    details: getDetails(err)
  }
}

function getDetails(err) {
  const details = [`Detail: ${err}`]
  if (/sort limit/.test(err)) {
    details.push("Reached internal line count limit")
  }
  return details
}

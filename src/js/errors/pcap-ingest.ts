import {BrimError} from "./types"

export default function(err: string): BrimError {
  return {
    type: "PCAPIngestError",
    message: "Unable to generate full summary logs from PCAP",
    details: getDetails(err)
  }
}

function getDetails(err) {
  const details = [`Detail: ${err}`]
  if (/sort limit/.test(err)) {
    details.push(
      "This PCAP contains too much network traffic to load into Brim."
    )
  }
  return details
}

export function parseContentType(resp: Response) {
  const type = resp.headers.get("Content-Type")
  switch (type) {
    case "application/json":
      try {
        return resp.json()
      } catch {
        console.error("Unable to parse json content, parsing as text instead")
        return resp.text()
      }
    case "text/html; charset=UTF-8":
    case "text/plain; charset=utf-8":
      return resp.text()
    case "application/vnd.tcpdump.pcap":
      return resp
    default:
      console.error(`unknown Content-Type: '${type}', parsing as text`)
      return resp.text()
  }
}

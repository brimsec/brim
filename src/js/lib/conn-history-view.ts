/*

  Records the state history of connections as a string of letters.
  The meaning of those letters is:

  Letter  Meaning
  s a SYN w/o the ACK bit set
  h a SYN+ACK (“handshake”)
  a a pure ACK
  d packet with payload (“data”)
  f packet with FIN bit set
  r packet with RST bit set
  c packet with a bad checksum
  t packet with retransmitted payload
  i inconsistent packet (e.g. FIN+RST bits set)
  q multi-flag packet (SYN+FIN or SYN+RST bits set)
  ^ connection direction was flipped by Bro’s heuristic

  If the event comes from the originator, the letter is in upper-case;
  if it comes from the responder, it’s in lower-case. Multiple packets
  of the same type will only be noted once (e.g. we only record one “d”
  in each direction, regardless of how many data packets were seen.)

*/
const TEXT_MAP = {
  q: "multi",
  i: "inconsistent",
  t: "retrans",
  c: "bad chksum",
  r: "rst",
  f: "fin",
  d: "data",
  h: "syn ack",
  a: "ack",
  s: "syn"
}

type Flag = {
  text: string
  direction: string
}

export default function connHistoryView(historyString: string): Flag[] {
  return historyString
    .split("")
    .filter(hasView)
    .map((char) => ({
      text: getText(char),
      direction: getDirection(char)
    }))
}

function hasView(char) {
  return Object.keys(TEXT_MAP).includes(char.toLowerCase())
}

function getText(char) {
  return TEXT_MAP[char.toLowerCase()]
}

function getDirection(char) {
  return char === char.toUpperCase() ? "right" : "left"
}

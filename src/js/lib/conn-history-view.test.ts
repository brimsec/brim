import connHistoryView from "./conn-history-view"

test("capital S goes to the right", () => {
  expect(connHistoryView("S")).toEqual([{text: "syn", direction: "right"}])
})

test("s a SYN w/o the ACK bit set", () => {
  expect(connHistoryView("s")).toEqual([{text: "syn", direction: "left"}])
})

test("h a SYN+ACK (“handshake”)", () => {
  expect(connHistoryView("h")).toEqual([{text: "syn ack", direction: "left"}])
})

test("a a pure ACK", () => {
  expect(connHistoryView("a")).toEqual([{text: "ack", direction: "left"}])
})

test("d packet with payload (“data”)", () => {
  expect(connHistoryView("d")).toEqual([{text: "data", direction: "left"}])
})

test("f packet with FIN bit set", () => {
  expect(connHistoryView("f")).toEqual([{text: "fin", direction: "left"}])
})

test("r packet with RST bit set", () => {
  expect(connHistoryView("r")).toEqual([{text: "rst", direction: "left"}])
})

test("c packet with a bad checksum", () => {
  expect(connHistoryView("c")).toEqual([
    {text: "bad chksum", direction: "left"}
  ])
})

test("t packet with retransmitted payload", () => {
  expect(connHistoryView("t")).toEqual([{text: "retrans", direction: "left"}])
})

test("i inconsistent packet (e.g. FIN+RST bits set)", () => {
  expect(connHistoryView("i")).toEqual([
    {text: "inconsistent", direction: "left"}
  ])
})

test("q multi-flag packet (SYN+FIN or SYN+RST bits set)", () => {
  expect(connHistoryView("q")).toEqual([{text: "multi", direction: "left"}])
})

test("complex history", () => {
  expect(connHistoryView("ShADd^qITc")).toEqual([
    {text: "syn", direction: "right"},
    {text: "syn ack", direction: "left"},
    {text: "ack", direction: "right"},
    {text: "data", direction: "right"},
    {text: "data", direction: "left"},
    {text: "multi", direction: "left"},
    {text: "inconsistent", direction: "right"},
    {text: "retrans", direction: "right"},
    {text: "bad chksum", direction: "left"}
  ])
})

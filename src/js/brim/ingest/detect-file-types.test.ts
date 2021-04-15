import ingest from "./"
import {itestFile} from "../../test/itest-file"

const json = itestFile("sample.ndjson")
const pcap = itestFile("sample.pcap")
const pcapng = itestFile("sample.pcapng")
const unknown = itestFile("plain.txt")
const zeek = itestFile("sample.tsv")

test("add file types", async () => {
  const files = [pcap, pcapng, zeek, json, unknown]
  const types = await ingest.detectFileTypes(files)

  expect(types).toEqual([
    {type: "pcap", file: pcap},
    {type: "pcap", file: pcapng},
    {type: "log", file: zeek},
    {type: "log", file: json},
    {type: "log", file: unknown}
  ])
})

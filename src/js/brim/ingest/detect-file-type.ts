import fs from "fs"

const PCAP_1_HEX = "d4c3b2a1"
const PCAP_2_HEX = "a1b2c3d4"
const PCAPNG_HEX = "0a0d0d0a"
const PCAPNANO_HEX = "4d3cb2a1"
const PCAP_HEXES = [PCAP_1_HEX, PCAP_2_HEX, PCAPNG_HEX, PCAPNANO_HEX]

export type IngestFileType = "pcap" | "log"

export default async function(path: string): Promise<IngestFileType> {
  if (await isPcap(path)) {
    return "pcap"
  } else {
    return "log"
  }
}

async function isPcap(file) {
  let bytes = await firstBytes(file, 4)
  for (let hex of PCAP_HEXES) {
    if (bytes instanceof Buffer && bytes.equals(Buffer.from(hex, "hex")))
      return true
  }
  return false
}

function firstBytes(file, n) {
  return new Promise((res, rej) => {
    let stream = fs.createReadStream(file, {start: 0, end: n - 1})
    stream
      .on("readable", () => {
        let buffer = stream.read(n)
        stream.close()
        res(buffer)
      })
      .on("error", rej)
  })
}

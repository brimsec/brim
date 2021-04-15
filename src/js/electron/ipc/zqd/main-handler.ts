import {ZQD} from "ppl/zqd/zqd"

export default function zqdMainHandler(zqd: ZQD) {
  if (zqd) {
    zqd.start()
    console.log("zqd started on: ", zqd.addr())
  }
}

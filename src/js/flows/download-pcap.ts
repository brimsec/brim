import {Thunk} from "../state/types"
import Packets from "../state/Packets"
import open from "../lib/open"
import {zng} from "zealot"

export const downloadPcap = (currentLog: zng.Record): Thunk => (dispatch) => {
  dispatch(Packets.fetch(currentLog)).then((pcapFile) =>
    open(pcapFile, {newWindow: true})
  )
}

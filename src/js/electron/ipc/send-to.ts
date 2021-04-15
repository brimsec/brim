import {IpcMsg} from "./types"

export default function sendTo(webContents: any, message: IpcMsg) {
  webContents.send(message.channel, message)
}

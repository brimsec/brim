import {meta} from "app/ipc/meta"
import {paths} from "app/ipc/paths"
import {serve} from "src/pkg/electron-ipc-service"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import windowsMainHandler from "./ipc/windows/mainHandler"
import secretsMainHandler from "./ipc/secrets/mainHandler"

export default function initializeMainIpc(brim) {
  windowsMainHandler(brim)
  globalStoreMainHandler(brim)
  secretsMainHandler()
  serve(paths)
  serve(meta)
}

import {meta} from "app/ipc/meta"
import {serve} from "src/pkg/electron-ipc-service"
/**
 * Add the rest of the ipc services here over time
 */
// export const testBrim = new Brim()

// windowsMainHandler(testBrim)
serve(meta)

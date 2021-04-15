import "regenerator-runtime/runtime"

import {remove, mkdirp} from "fs-extra"
import {itestDir} from "./lib/env"

module.exports = async () => {
  await remove(itestDir())
  await mkdirp(itestDir())
}

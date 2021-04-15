import electron from "electron"

const app =
  (electron && electron.app) || (electron.remote && electron.remote.app)

const isEnvSet = "ELECTRON_IS_DEV" in process.env
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1

export default isEnvSet ? getFromEnv : app && !app.isPackaged

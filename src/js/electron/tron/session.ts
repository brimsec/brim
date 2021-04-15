import {get} from "lodash"
import log from "electron-log"

import {app} from "electron"
import path from "path"

import {SessionState} from "./format-session-state"
import {isNumber} from "../../lib/is"
import lib from "../../lib"
import tron from "./"

export default function session(path: string = sessionStateFile()) {
  let version = 0

  return {
    getVersion() {
      return version
    },

    save(data: SessionState, p: string = path) {
      return lib.file(p).write(JSON.stringify({version, data}))
    },

    load: async function(): Promise<SessionState | null | undefined> {
      const migrator = await tron.migrations()
      const file = lib.file(path)

      version = migrator.getLatestVersion()

      if (await file.exists()) {
        return await file
          .read()
          .then(JSON.parse)
          .then((state) => migrate(state, migrator))
          .then((state) => state.data)
          .catch((e) => {
            log.error("Unable to load session state")
            log.error(e)
            return undefined
          })
      } else {
        return undefined
      }
    },

    async delete() {
      const file = lib.file(path)
      if (await file.exists()) {
        return file.remove()
      }
    }
  }
}

export function sessionStateFile() {
  // This can't be a const because we adjust the
  // userData path first thing inside main().
  return path.join(app.getPath("userData"), "appState.json")
}

type VersionedState = {version: number; data: SessionState | null | undefined}

async function migrate(appState, migrator): Promise<VersionedState> {
  const state = ensureVersioned(appState)

  if (!canMigrate(state)) {
    log.info("migrations: unsupported version, using fresh state")
    return freshState(migrator.getLatestVersion())
  }

  migrator.setCurrentVersion(state.version)
  const pending = migrator.getPending().length

  log.info(`migrations: currentVersion=${state.version} pending=${pending}`)

  if (pending) {
    try {
      log.info("migrations: running")
      const nextState = migrator.runPending(state)
      log.info(`migrations: currentVersion=${nextState.version}`)
      return nextState
    } catch (e) {
      log.error("Unable to migrate data")
      log.error(e)
      return freshState(migrator.getLatestVersion())
    }
  } else {
    return state
  }
}

function ensureVersioned(state) {
  if (isNumber(state.version)) return state
  else
    return {
      version: 0,
      data: state
    }
}

function canMigrate(state: VersionedState) {
  const legacyVersion = get(state.data, "globalState.version")

  if (!legacyVersion) return true // Already migrated up
  if (legacyVersion === "7") return true // Release right before migration support
  return false // Anything other than above is not migratable
}

function freshState(version): VersionedState {
  return {data: undefined, version}
}

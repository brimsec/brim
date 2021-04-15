import {isEmpty} from "lodash"
import {outputFileSync, pathExistsSync, mkdirpSync} from "fs-extra"
import log from "electron-log"

import {app} from "electron"
import {join, resolve} from "path"
import {spawn, ChildProcess} from "child_process"

import * as cmd from "src/js/stdlib/cmd"
import electronIsDev from "src/js/electron/is-dev"

// Paths for the zqd and zeek programs. If the app has been built as a release then it will be contained in an asar archive
// but the zdeps will have been included in the .unpacked directory along side the archived app, hence the replace here. This
// pattern would apply to any assets under the 'asarUnpack' key of the electron-builder.json config
const zdepsDirectory = join(
  app.getAppPath().replace("app.asar", "app.asar.unpacked"),
  "zdeps"
)

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    suricataRunnerBin: "suricatarunner",
    suricataUpdaterBin: "suricataupdater",
    zeekRunnerBin: "zeekrunner"
  },
  linux: {
    zqdBin: "zqd",
    suricataRunnerBin: "suricatarunner",
    suricataUpdaterBin: "suricataupdater",
    zeekRunnerBin: "zeekrunner"
  },
  win32: {
    zqdBin: "zqd.exe",
    suricataRunnerBin: "suricatarunner.exe",
    suricataUpdaterBin: "suricataupdater.exe",
    zeekRunnerBin: "zeekrunner.exe"
  }
}

function writeZqdConfigFile(): string {
  const logDir = app.getPath("logs")
  // @ts-ignore
  mkdirpSync(logDir, {recursive: true, mode: 0o755})

  const zqdLogFile = join(logDir, "zqd.log")

  log.info("zqd core log", zqdLogFile)

  const data = `
logger:
  path: ${zqdLogFile}
  level: info
  mode: rotate
`

  const confFile = join(app.getPath("userData"), "zqd-config.yaml")
  log.info("zqd config", confFile)

  outputFileSync(confFile, data)
  return confFile
}

function zqdCommand(): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  if (electronIsDev && process.env.brim_zqd_from_path) {
    if (cmd.notExists("zqd").length > 0) {
      throw new Error("brim_zqd_from_path is set but zqd not in path")
    }
    return plat.zqdBin
  }

  const zqdBin = resolve(join(zdepsDirectory, plat.zqdBin))
  if (!pathExistsSync(zqdBin)) {
    throw new Error("zqd binary not present at " + zqdBin)
  }
  return zqdBin
}

function suricataRunnerCommand(suricataRunnerPref: string): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  const precedence = [
    process.env.BRIM_SURICATA_RUNNER,
    suricataRunnerPref,
    resolve(join(zdepsDirectory, "suricata", plat.suricataRunnerBin))
  ]

  return precedence.find((path) => !isEmpty(path)) || ""
}

function suricataUpdaterCommand(suricataUpdaterPref: string): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  const precedence = [
    process.env.BRIM_SURICATA_UPDATER,
    suricataUpdaterPref,
    resolve(join(zdepsDirectory, "suricata", plat.suricataUpdaterBin))
  ]

  return precedence.find((path) => !isEmpty(path)) || ""
}

function zeekRunnerCommand(zeekRunnerPref: string): string {
  const plat = platformDefs[process.platform]
  if (!plat) {
    throw new Error("unsupported platform for zqd")
  }

  const precedence = [
    process.env.BRIM_ZEEK_RUNNER,
    zeekRunnerPref,
    resolve(join(zdepsDirectory, "zeek", plat.zeekRunnerBin))
  ]

  return precedence.find((path) => !isEmpty(path)) || ""
}

export class ZQD {
  zqd: ChildProcess
  root: string
  suricataRunner: string
  suricataUpdater: string
  zeekRunner: string

  constructor(
    rootDir: string,
    suricataRunner: string,
    suricataUpdater: string,
    zeekRunner: string
  ) {
    this.root = rootDir
    this.suricataRunner = suricataRunner
    this.suricataUpdater = suricataUpdater
    this.zeekRunner = zeekRunner
  }

  start() {
    // @ts-ignore
    mkdirpSync(this.root, {recursive: true, mode: 0o755})

    const opts = {
      stdio: ["inherit", "inherit", "inherit"]
    }

    const confFile = writeZqdConfigFile()

    const args = [
      "listen",
      "-l",
      this.addr(),
      "-data",
      this.root,
      "-config",
      confFile,
      "-suricatarunner",
      suricataRunnerCommand(this.suricataRunner),
      "-suricataupdater",
      suricataUpdaterCommand(this.suricataUpdater),
      "-zeekrunner",
      zeekRunnerCommand(this.zeekRunner)
    ]

    // For unix systems, pass posix pipe read file descriptor into zqd process.
    // In the event of Brim getting shutdown via `SIGKILL`, this will let zqd
    // know that it has been orphaned and to shutdown.
    if (process.platform !== "win32") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {readfd} = require("node-pipe").pipeSync()
      opts.stdio.push(readfd)
      args.push(`-brimfd=${opts.stdio.length - 1}`)
    }
    log.info("spawning zqd:", zqdCommand(), args.join(" "))

    const suricataUserDir = join(app.getPath("userData"), "suricata")
    process.env.BRIM_SURICATA_USER_DIR = suricataUserDir

    // @ts-ignore
    this.zqd = spawn(zqdCommand(), args, opts)
    this.zqd.on("error", (err) => {
      // XXX should notify renderers of error
      log.error("zqd spawn error", err)
    })
  }

  // XXX Eventually we'll have the os choose a dynamic port. For now just
  // return static localhost:9867 as the zqd address.
  addr(): string {
    return "localhost:9867"
  }

  async close(): Promise<void> {
    if (this.zqd) {
      // give zqd 5 seconds to exit
      let giveUp = false
      setTimeout(() => {
        giveUp = true
      }, 5000)

      this.zqd.kill("SIGTERM")
      while (!giveUp && (await isUp())) {
        await new Promise((res) => setTimeout(res, 500))
      }

      if (giveUp) {
        log.error("gave up waiting for zqd to shutdown")
      } else {
        log.info("zqd has shutdown")
      }
    }
  }
}

async function isUp() {
  try {
    const response = await fetch("http://localhost:9867/status")
    const text = await response.text()
    return text === "ok"
  } catch (e) {
    return false
  }
}

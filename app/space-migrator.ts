import {spawn, ChildProcess} from "child_process"
import fs from "fs-extra"
import readline from "readline"

// zdeps/brimcap migrate -zqd="run/data/spaces" -root="run/data/brimcap-root"
export default class SpaceMigrator {
  process: ChildProcess | null

  constructor(readonly srcDir: string, readonly destDir: string) {}

  needMigration() {
    if (fs.existsSync(this.srcDir)) {
      const files = fs.readdirSync(this.srcDir)
      return files.some((f) => f.startsWith("sp_"))
    } else {
      return false
    }
  }

  cancel() {
    if (this.process) {
      this.process.kill()
    }
  }

  async migrate(onUpdate) {
    await fs.ensureDir(this.destDir)
    return new Promise<void>((resolve, reject) => {
      this.process = spawn("zdeps/brimcap", [
        "migrate",
        `-zqd=${this.srcDir}`,
        `-root=${this.destDir}`
      ])
      const linesErr = readline.createInterface({input: this.process.stderr})
      let total = 0
      let count = 0
      let space = ""
      let totalRegexp = /^migrating (\d+) spaces$/

      linesErr.on("line", (line) => {
        const status = tryJson(line.toString())
        if ("msg" in status) {
          const match = status.msg.match(totalRegexp)
          if (match) {
            total = parseInt(match[1])
          }
        }
        if ("space" in status && status.space !== space) {
          space = status.space
          count++
          onUpdate({total, space, count})
        }
      })

      this.process.on("error", (e) => {
        reject(e)
      })

      this.process.on("exit", (code) => {
        if (this.process.killed) {
          reject("Migration was cancelled")
        } else if (code !== 0) {
          reject("Migration failed")
        } else resolve()
      })
    }).finally(() => {
      this.process = null
    })
  }
}

function tryJson(data) {
  try {
    return JSON.parse(data)
  } catch {
    return {}
  }
}

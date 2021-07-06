import path from "path"
import lib from "../lib"
import BrimApi from "../api"
import {forEach} from "lodash"

interface Plugin {
  activate(api: BrimApi): void

  deactivate(): Promise<void>
}

export default class PluginManager {
  private plugins: {
    [pluginName: string]: Plugin
  } = {}

  constructor(private api: BrimApi) {}

  async load(dir: string) {
    const files = await lib.file(dir).contents()

    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const pluginDir = lib.file(path.join(dir, f))
      if (!(await pluginDir.isDirectory())) {
        console.error("Plugin must be contained in a directory.")
        return
      }

      const pluginName = pluginDir.fileName()
      const index = process.env.NODE_ENV === "test" ? "index.ts" : "index.js"
      const entryPoint = path.join(dir, pluginName, index)
      if (!lib.file(entryPoint).existsSync()) {
        console.error(
          "Plugin directory must contain an index file as the entry point."
        )
        return
      }

      const {activate, deactivate = () => {}} = require(entryPoint)
      if (this.plugins[pluginName]) {
        console.error(
          new Error(`Duplicate or name collision for '${pluginName}' plugin`)
        )
        return
      }

      this.plugins[pluginName] = {activate, deactivate}
    }
  }

  activate() {
    forEach(this.plugins, (p) => p.activate(this.api))
  }

  async deactivate(): Promise<void> {
    await Promise.all(Object.values(this.plugins).map((p) => p.deactivate()))
  }
}

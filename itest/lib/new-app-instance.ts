import {existsSync} from "fs"
import path from "path"

import {mkdirpSync} from "fs-extra"
import electronPath from "electron"
import {Application} from "spectron"

import {isCI, itestDir, repoDir} from "./env"
import {LOG} from "./log"

export default (name: string, idx: number): Application => {
  const macInstallPath = "/Applications/Brim.app/Contents/MacOS/Brim"
  const linuxInstallPath = "/usr/bin/brim"
  const userDataDir = path.resolve(path.join(itestDir(), name, idx.toString()))
  const webdriverLogDir = "webdriverLogFiles"
  mkdirpSync(path.resolve(userDataDir, webdriverLogDir))

  // https://github.com/electron-userland/spectron#new-applicationoptions
  let appArgs = {
    chromeDriverArgs: [`--user-data-dir=${userDataDir}`],
    startTimeout: 60000,
    waitTimeout: 25000,
    quitTimeout: 10000,
    chromeDriverLogPath: path.join(userDataDir, "chromedriver.log"),
    webdriverLogPath: path.join(userDataDir, webdriverLogDir),
    // Latest compatible spectron and webdriverio lead to the
    // following:
    //  console.warn node_modules/webdriverio/build/lib/helpers/deprecationWarning.js:12
    //    WARNING: the "<cmd>" command will be deprecated soon. If you have further questions, reach out in the WebdriverIO Gitter support channel (https://gitter.im/webdriverio/webdriverio).
    //    Note: This command is not part of the W3C WebDriver spec and won't be supported in future versions of the driver. It is recommended to use the actions command to emulate pointer events.
    //
    //    (You can disable this warning by setting `"deprecationWarnings": false` in your WebdriverIO config)
    // for <cmd> in the following:
    //   buttonPress
    //   moveTo
    // Test code isn't using these directly according to git grep, which
    // means this is something one of my dependencies must fix. Ignore the
    // warnings for now.
    webdriverOptions: {
      deprecationWarnings: false
    },
    path: undefined,
    args: undefined
  }

  // If we are CI, on a platform whose CI is expected to build releases,
  // and a release is installed, point to that. Otherwise run out of
  // dev. In some CI cases, we will not build releases and install them.
  if (isCI() && process.platform === "darwin" && existsSync(macInstallPath)) {
    appArgs = {...appArgs, path: macInstallPath}
    LOG.debug("Chose installed MacOS app location", macInstallPath)
  } else if (
    isCI() &&
    process.platform === "linux" &&
    existsSync(linuxInstallPath)
  ) {
    appArgs = {...appArgs, path: linuxInstallPath}
    LOG.debug("Chose installed Linux app location", linuxInstallPath)
  } else {
    appArgs = {...appArgs, path: electronPath, args: [repoDir()]}
    LOG.debug("Chose working copy app location", electronPath)
  }

  return new Application(appArgs)
}

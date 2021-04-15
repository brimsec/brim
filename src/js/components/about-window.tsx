import React from "react"

import {execSync} from "child_process"
import {join} from "path"
import {remote} from "electron"

import BrimTextLogo from "./brim-text-logo"
import Octocat from "../icons/Octocat"
import TextContent from "./text-content"
import electronIsDev from "../electron/is-dev"
import open from "../lib/open"

export default function AboutWindow() {
  let appVersion = remote.app.getVersion()
  if (electronIsDev) {
    try {
      appVersion = execSync("git describe --tags --dirty").toString()
    } catch {
      // swallow this catch and just use release version as is if no git
    }
  }
  const year = new Date().getFullYear()
  const pathRoot = remote.app
    .getAppPath()
    .replace("app.asar", "app.asar.unpacked")
  const ackFilePath = join(pathRoot, "acknowledgments.txt")
  const licFilePath = join(pathRoot, "LICENSE.txt")

  return (
    <div className="about-window">
      <div className="about-logo">
        <BrimTextLogo />
      </div>
      <TextContent>
        <div className="about-content">
          <section>
            <label>Version</label>
            <p>{appVersion}</p>
          </section>
          <section>
            <label>Website</label>
            <a onClick={() => open("https://www.brimsecurity.com")}>
              Brim Security, Inc.
            </a>
          </section>
          <section>
            <label>Source</label>
            <div className={"octocat-small"}>
              <Octocat />
            </div>
            <a onClick={() => open("https://github.com/brimdata/brim")}>
              Repository
            </a>
          </section>
          <hr />
          <footer>
            <section>
              <a onClick={() => open(licFilePath)}>License</a>
            </section>
            <section>
              <a onClick={() => open(ackFilePath)}>Acknowledgments</a>
            </section>
            <section>
              <p>Copyright {year} Brim Security, Inc.</p>
            </section>
          </footer>
        </div>
      </TextContent>
    </div>
  )
}

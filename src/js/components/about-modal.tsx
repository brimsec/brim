import React from "react"

import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/modal-box"
import TextContent from "./text-content"
import LogoType from "../icons/logo-type"
import Octocat from "../icons/Octocat"
import {remote} from "electron"
import {join} from "path"
import open from "../lib/open"
import electronIsDev from "../electron/is-dev"
import {execSync} from "child_process"

export default function AboutModal() {
  let appVersion = remote.app.getVersion()
  if (electronIsDev) {
    try {
      appVersion = execSync("git describe --tags --dirty").toString()
    } catch {
      // swallow this catch and just use release version as is if no git
    }
  }
  const year = new Date().getFullYear()
  const pathRoot = remote.app.getAppPath()
  const ackFilePath = join(pathRoot, "acknowledgments.txt")
  const licFilePath = join(pathRoot, "LICENSE.txt")

  return (
    <ModalBox
      name="about"
      title=""
      buttons={[]}
      className="about-modal"
      {...reactElementProps("aboutModal")}
    >
      <div className="about-logo">
        <div className="logo">
          <LogoType />
        </div>
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
          <section>
            <a onClick={() => open(licFilePath)}>License</a>
          </section>
          <section>
            <a onClick={() => open(ackFilePath)}>Acknowledgments</a>
          </section>
          <section>
            <p>Copyright {year} Brim Security, Inc.</p>
          </section>
        </div>
      </TextContent>
    </ModalBox>
  )
}

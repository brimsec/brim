// This is needed to use zealot outside a browser.
global.fetch = require("node-fetch")

import {execSync} from "child_process"
import path from "path"

import {createZealot} from "zealot"

import {retryUntil} from "../lib/control"
import {nodeZedDistDir} from "../lib/env"
import {handleError} from "../lib/jest"
import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/new-app-instance"

describe("Lake tests", () => {
  let app
  let testIdx = 0
  const ZED = path.join(nodeZedDistDir(), "zed")
  const LAKE_SPACE_NAME = "sample.zar"
  beforeAll(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return appStep.startApp(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  test(`Brim starts when a lake space is present`, (done) => {
    appStep
      .ingestFile(app, "sample.tsv")
      .then(async () => {
        // Use zealot to
        // 1. Create a new space
        // 2. Find the path to sample.tsv.brim's all.zng
        const client = createZealot("localhost:9867")

        const sampleSpace = (await client.spaces.list())[0]
        const lakeSpace = await client.spaces.create({name: LAKE_SPACE_NAME})

        const zngFile = sampleSpace.data_path + "/all.zng"
        const lakeRoot = lakeSpace.data_path

        // Create a lake inside the space.
        const options = {env: {...process.env, ZED_LAKE_ROOT: lakeRoot}}
        execSync(`"${ZED}" lake init `, options)
        execSync(`"${ZED}" lake create -p default -S 1024B`, options)
        execSync(`"${ZED}" lake load -p default "${zngFile}"`, options)

        // Make sure zqd identifies both spaces.
        retryUntil(
          () => client.spaces.list(),
          (spaces) => spaces.length === 2
        )

        // Reload the app so that it reads the new space.
        await appStep.reload(app)
        await appStep.click(app, ".add-tab")
        await (await app.client.$(`=${LAKE_SPACE_NAME}`)).waitForDisplayed()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})

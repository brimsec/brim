import log from "electron-log"

export default () => {
  beforeAll(() => {
    log.transports.console.level = false
  })

  afterAll(() => {
    log.transports.console.level = "silly"
  })
}
